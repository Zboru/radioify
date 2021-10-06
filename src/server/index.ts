import {AuthorizationCodeResponse} from "./types";

require('dotenv').config()
import * as express from 'express';
import * as path from "path";

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



app.post('/api/authorize', async (req: express.Request, res: express.Response) => {
    const code = req.body.code;
    spotifyApi.authorizationCodeGrant(code).then((data: AuthorizationCodeResponse) => {
        res.send({
            access_token: data.body.access_token,
            refresh_token: data.body.refresh_token
        })
    }).catch((err: any) => {
        console.log(err)
    })
});

app.get('/api/getProfile', async (req: express.Request, res: express.Response) => {
    console.log("Getting profile")
    const accessToken = req.query.code
    spotifyApi.setAccessToken(accessToken);
    const profileData = await spotifyApi.getMe();
    res.send(profileData);
});

app.get('/*', (req: express.Request, res: express.Response) => {
    res.sendFile(distPath + '/index.html');
});

app.listen(port);
console.log(`App listening on ${port}`);


