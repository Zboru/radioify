export interface SpotifyAuthorizeResponse {
    access_token: string,
    refresh_token: string
}

export interface SpotifyTokens {
    access_token: string,
    refresh_token: string
}

export interface SpotifyProfileResponse {
    body: {
        display_name: string,
        uri: string,
        images: [
            { url: string }
        ]
    }
}

export interface SpotifyProfile {
    name: string,
    image: string,
    uri: string
}
