import SpotifyWebApi from "spotify-web-api-js";

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
    return await spotifyApi.getMe();
}
