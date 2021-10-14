import {Request, Response} from "express";

const SpotifyWebApi = require('spotify-web-api-node');
import {AuthorizationCodeResponse, SpotifyTrack} from "./types";
import {RadioListResponse, SpotifyPlaylistItem, SpotifyProfile} from "../client/types";
import axios from "axios";
import {getSongsFromDateSpan} from "../client/utils/radio";
import dayjs = require("dayjs");

function chunk(arr: any[], size: number) {
    return Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
        arr.slice(i * size, i * size + size)
    )
}

const express = require('express');
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URL
});

router.get('/api/radiolist', async (req: Request, res: Response) => {
    const RADIOLIST_URL = "https://ods.lynx.re/radiolst.php";
    axios.get<RadioListResponse>(RADIOLIST_URL).then((response) => {
        const radioList = response.data.summary.flatMap(group => group.stations)
        res.send(radioList);
    })
});

router.get('/api/getRadioTracks', async (req: Request, res: Response) => {
    const {radioID, startDate, endDate, startHour, endHour} = req.params
    const data = await getSongsFromDateSpan(parseInt(radioID), startDate, endDate, parseInt(startHour), parseInt(endHour));
    res.send(data);
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

router.get('/api/getPlaylists', async (req: Request, res: Response) => {
    console.log("====\tGetting profile")
    const {refreshToken} = req.query
    await refreshAccessToken(refreshToken)
    spotifyApi.getUserPlaylists({'limit': 50}).then((response: any) => {
        res.send(response);
    })
});

router.post('/api/addNewPlaylist', async (req: Request, res: Response) => {
    console.log("====\tAdding new playlist")
    const {refreshToken, name} = req.body
    await refreshAccessToken(refreshToken);
    spotifyApi.createPlaylist(name).then((response: any) => {
        res.send(response)
    })
});

router.post('/api/addToPlaylist', async (req: Request, res: Response) => {
    const {refreshToken, playlist, songs} = req.body
    await refreshAccessToken(refreshToken)

    // Delete all duplicates from playlist
    const removeTracksURIs = chunk(songs.map((track: SpotifyPlaylistItem) => {
        return {uri: track.uri}
    }), 100)
    const removePromises = [];
    for (let index in removeTracksURIs) {
        removePromises.push(spotifyApi.removeTracksFromPlaylist(playlist.id, removeTracksURIs[index], {snapshot_id: playlist.snapshot_id}))
    }
    await Promise.allSettled(removePromises)

    // Add new tracks to playlist
    const newTracksURIs = chunk(songs.map((track: SpotifyPlaylistItem) => {
        return track.uri
    }), 100)
    const newTrackPromises = [];
    for (let index in newTracksURIs) {
        newTrackPromises.push(spotifyApi.addTracksToPlaylist(playlist.id, newTracksURIs[index]));
    }
    await Promise.allSettled(newTrackPromises)

    res.send({message: 'ok'}).status(201)
});

export default router
