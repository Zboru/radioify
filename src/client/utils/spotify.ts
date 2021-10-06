export function createAuthorizeURL() {
    const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative',
    ];
    const redirect_uri = "http://localhost:4444/";
    return "https://accounts.spotify.com/authorize" +
        '?response_type=code' +
        '&client_id=' + '35c3ca464dc14fa09a78b2d2353f1e0d' +
        (scopes ? '&scope=' + encodeURIComponent(scopes.join(" ")) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri);
}
