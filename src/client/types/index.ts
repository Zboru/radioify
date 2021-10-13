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
    name?: string,
    image: string,
    uri: string
}

export interface SpotifyTrack {
    name: string,
}

export interface SpotifyPlaylistItem {
    name: string,
    uri: string,
    snapshot_id: string,
    owner: {
        uri: string
    }
}

export interface SpotifyPlaylistResponse {
    body: {
        items: SpotifyPlaylistItem[]
    }
}

// API Radiolist types
export interface StationResponse {
    id: number,
    name: string
}

export interface RadioListGroup {
    groupName: string,
    stations: StationResponse[],
}

export interface RadioListResponse {
    success: boolean,
    summary: RadioListGroup[]
}

export interface Station {
    description: string;
    id: number,
    title: string
}

// API Playlist types
export interface PlaylistItem {
    time: string,
    title: string,
}

export interface PlaylistResponse {
    success: boolean,
    name: string,
    date: string,
    timeFrom: string,
    summary: PlaylistItem[]
}
