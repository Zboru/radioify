export interface AuthorizationCodeResponse {
    body: {
        access_token: string,
        token_type: string,
        expires_in: number,
        refresh_token: string,
        scope: string
    }
}

export interface RefreshTokenResponse {
    body: {
        access_token: string,
        token_type: string,
        expires_in: number,
        scope: string
    }
}

export interface SpotifyTrack {
    name: string,
    uri: string,
}

export interface getRadiostationTracks {
    radioID: number
    startDate: string,
    endDate: string,
    startHour: number,
    endHour: number,
}
