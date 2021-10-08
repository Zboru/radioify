import {AuthorizationCodeResponse} from "./types";

require('dotenv').config()
import * as express from 'express';
import * as path from "path";
import {SpotifyProfile} from "../client/types";

const SpotifyWebApi = require('spotify-web-api-node');
const app: express.Application = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:4444/"
});


app.use(express.urlencoded({extended: true}) as express.RequestHandler);
app.use(express.json() as express.RequestHandler)

const port: number = Number(process.env.PORT) || 4444;

const distPath = path.resolve(`${__dirname}../../../dist`);
app.use(express.static(distPath));

app.get('/api/login', async(req: express.Request, res: express.Response) => {
    const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative',
    ];
    try {
        const html = spotifyApi.createAuthorizeURL(scopes);
        res.send(html+"&show_dialog=true");
    } catch (e) {
        console.error(e);
    }
});


app.post('/api/authorize', async (req: express.Request, res: express.Response) => {
    const code = req.body.code;
    spotifyApi.authorizationCodeGrant(code).then((data: AuthorizationCodeResponse) => {
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        res.send({
            access_token: data.body.access_token,
            refresh_token: data.body.refresh_token
        })
    }).catch((err: any) => {
        console.log(err)
    })
});

app.get('/api/getProfile', async (req: express.Request, res: express.Response) => {
    console.log("====\tGetting profile")
    const {accessToken} = req.query
    spotifyApi.setAccessToken(accessToken);
    const data = await spotifyApi.getMe()
    const profile: SpotifyProfile = {
        name: data.body.display_name,
        image: data.body.images[0].url,
        uri: data.body.uri
    }
    res.send(profile)
});

app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(distPath + '/index.html');
});

app.listen(port);
console.log(`App listening on ${port}`);


