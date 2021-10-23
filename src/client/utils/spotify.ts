import {SpotifyWebApi} from 'spotify-web-api-ts';
import {SpotifyTrack} from "../../server/types";
import {Song} from "../components/create/steps/Step3";

const spotifyApi = new SpotifyWebApi();

const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative'
    ],
    redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URL || "",
    clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "",
    showDialog = true,
    responseType = 'token';


export function createAuthorizationURL() {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=' + encodeURIComponent(responseType);
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scopes.join(' '));
    url += '&redirect_uri=' + encodeURIComponent(redirectUri);
    url += '&show_dialog=' + encodeURIComponent(showDialog);

    return url;
}

export async function getMe(access_token: string) {
    spotifyApi.setAccessToken(access_token);
    return await spotifyApi.users.getMe()
}


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
        const foundTracks = await spotifyApi.search.searchTracks(`track:${title} artist:${artist}`);
        if (foundTracks?.items.length) {
            const tracks = foundTracks.items;
            return tracks[0];
        }
    }
}

export let fetchProgress = 0;

export async function fetchTracks(access_token: string, songs: Song[]) {
    spotifyApi.setAccessToken(access_token);
    fetchProgress = 0;
    const notFoundSongs = [];
    const tracks = [];
    for await (let song of songs) {
        const track: SpotifyTrack | undefined = await findSpotifyTrack(song.title);
        if (track === undefined) {
            notFoundSongs.push(song);
        } else {
            tracks.push(track);
        }
        fetchProgress += 1;
    }
    return {tracks, notFoundSongs};
}

export async function getPlaylists(access_token: string) {
    spotifyApi.setAccessToken(access_token);
    spotifyApi.playlists.getMyPlaylists({'limit': 50}).then((response: any) => {
        return response
    })
}

export async function createNewPlaylist(access_token: string, playlistName: string) {
    spotifyApi.setAccessToken(access_token);
    const currentUser = await spotifyApi.users.getMe();
    spotifyApi.playlists.createPlaylist(currentUser.id, playlistName).then(response => {
        return response
    })
}
