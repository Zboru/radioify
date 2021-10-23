export interface SpotifyProfile {
    name?: string,
    image: string,
    uri: string
}

export interface SpotifyTrack {
    name: string,
    uri: string,
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

// App types

export interface getRadiostationTracks {
    radioID: number
    startDate: string,
    endDate: string,
    startHour: number,
    endHour: number,
}
