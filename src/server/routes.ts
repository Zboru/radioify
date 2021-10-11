import {Request, Response} from "express";

const SpotifyWebApi = require('spotify-web-api-node');
import {AuthorizationCodeResponse, RefreshTokenResponse, SpotifyTrack} from "./types";
import {SpotifyProfile} from "../client/types";

const express = require('express');
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/"
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

async function refreshAccessToken(refresh_token: any) {
    console.log("Refreshing access token!")
    await spotifyApi.setRefreshToken(refresh_token)
    const {body} = await spotifyApi.refreshAccessToken();
    await spotifyApi.setAccessToken(body.access_token)
}

router.get('/api/getProfile', async (req: Request, res: Response) => {
    console.log("====\tGetting profile")
    const {refreshToken} = req.query
    await refreshAccessToken(refreshToken)
    spotifyApi.getMe().then((response: any) => {
        const profile: SpotifyProfile = {
            name: response.body.display_name,
            image: response.body.images[0].url,
            uri: response.body.uri
        }
        res.send(profile);
    })
});


async function findSpotifyTrack(song: string) {
    const songDetails = song.split(' - ');
    // Remove obsolete strings from artist and track name
    const artists = songDetails[0].trim().split(/[&;\/(feat.)]/)
    let title;
    if (songDetails[1]) {
        title = songDetails[1].trim().split(/(feat)|(ft)|(prod)|[(]/gi)[0].split("\'").join("");
    } else {
        title = "";
    }
    for await (let artist of artists) {
        artist = artist.split("\'").join("");
        const searchQuery = await spotifyApi.searchTracks(`track:${title} artist:${artist}`);
        if (searchQuery?.body.tracks.items.length) {
            const tracks = searchQuery.body.tracks.items;
            return tracks[0];
        }
    }
}

router.post('/api/searchSongs', async (req: Request, res: Response) => {
    console.log("====\tSearching songs")
    let notFoundSongs = [];
    const tracks = [];
    const songList = req.body.songs;
    const tokens = req.body.tokens;
    await refreshAccessToken(tokens.refresh_token)
    for await (let song of songList) {
        const track: SpotifyTrack = await findSpotifyTrack(song.title);
        // If there's no song, decrement total song count
        if (track === undefined) {
            notFoundSongs.push(song);
        } else {
            tracks.push(track);
        }
    }
    res.send({tracks, notFoundSongs});
});

export default router
