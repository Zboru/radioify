import {Request, Response} from "express";
const SpotifyWebApi = require('spotify-web-api-node');
import {AuthorizationCodeResponse, SpotifyTrack} from "./types";
import {SpotifyPlaylistItem, SpotifyProfile} from "../client/types";
import {getRadiostationList, getRadiostationTracks} from "./services";
import {chunk} from "./utils";


const express = require('express');
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URL
});

router.get('/api/radiolist', async (req: Request, res: Response) => {
    const data = await getRadiostationList();
    res.send(data);
});

router.get('/api/getRadioTracks', async (req: Request, res: Response) => {
    const {radioID, startDate, endDate, startHour, endHour} = req.query
    if (typeof radioID === "string" &&
        typeof startDate === "string" &&
        typeof endDate === "string" &&
        typeof startHour === "string" &&
        typeof endHour === "string") {
        const data = await getRadiostationTracks({
            radioID: parseInt(radioID),
            startDate,
            endDate,
            startHour: parseInt(startHour),
            endHour: parseInt(endHour)
        });
        res.send(data);
    }
});

router.get('/api/login', async (req: Request, res: Response) => {
    const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative',
    ];
    try {
        const html = spotifyApi.createAuthorizeURL(scopes, 'state', true);
        res.send(html);
    } catch (e) {
        console.error(e);
    }
});

router.post('/api/authorize', async (req: Request, res: Response) => {
    const code = req.body.code;
    console.log(code)
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




export default router
