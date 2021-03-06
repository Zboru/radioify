import React, {
    ChangeEvent,
    createRef,
    Dispatch,
    MouseEventHandler, useEffect,
    useState
} from "react";
import {Song} from "./Step3";
import TextField from "../../general/TextField";
import Fuse from "fuse.js";
import {useSessionStorage} from "../../../hooks/useSessionStorage";
import {SpotifyTrack} from "../../../types";
import RButton from "../../general/RButton";
import Card from "../Card";
import {fetchProgress, fetchTracks} from "../../../utils/spotify";

export interface notFoundSong {
    title: string,
    excluded: boolean
}

export interface spotifySongs {
    notFoundSongs: notFoundSong[],
    tracks: SpotifyTrack[]
}

const Step4 = (props: {
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    songs: Song[],
    spotifySongs: spotifySongs | null,
    setSpotifySongs: Dispatch<any>,
    setSongs: Dispatch<Song[]>,
}) => {
    const [searching, setSearching] = useState(false);
    const [songFilter, setSongFilter] = useState<string | null>(null)
    const [spotifyToken, setTokens] = useSessionStorage('spotifyToken', null);
    const songListContainer = createRef<HTMLDivElement>();
    const [searchProgress, setProgress] = useState(0);

    useEffect(()=>{
        setInterval(()=>{
            setProgress(fetchProgress)
        }, 200);
    }, []);

    function handleFilterChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.currentTarget.value
        if (songListContainer.current) {
            songListContainer.current.scrollTop = 0;
        }
        setSongFilter(value);
    }

    function toggleSong(event: ChangeEvent<HTMLInputElement>, song: Song) {
        const songs = [...props.songs];
        const songIndex = songs.indexOf(song);
        songs[songIndex].excluded = !event.currentTarget.checked
        props.setSongs(songs)
    }

    const options = {
        includeScore: true,
        keys: ['title'],
    }
    const fuse = new Fuse(props.songs, options)

    function filteredSongs(filter: string | null) {
        if (filter) {
            return fuse.search(filter).map(result => result.item);
        } else {
            return props.songs
        }
    }

    function searchDuration() {
        return (props.songs?.length / 4.8).toFixed(2)
    }

    function searchSongs() {
        setSearching(true)
        const notExcludedSongs = props.songs.filter(song => !song.excluded)
        fetchTracks(spotifyToken.token, notExcludedSongs).then(response => {
            props.setSpotifySongs(response);
            setSearching(false);
        })
    }

    return (
        <Card active={props.active}>
            <p>Sprawd?? pobran?? list?? i zaznacz utwory, kt??re maj?? zosta?? wyszukane w serwisie Spotify. Utwory odznaczone
                zostan?? wykluczone z wyszukiwania oraz umieszczenia w playli??cie.</p>
            <div className="flex">
                <div className="flex-grow"/>
                <TextField onChange={handleFilterChange} placeholder={"Wyszukaj utw??r"}/>
            </div>
            <div ref={songListContainer}
                 className="overflow-auto border rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 h-56 w-100">
                {filteredSongs(songFilter).map((song: Song, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:bg-gray-900 bg-white pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <input onChange={(event) => {
                                toggleSong(event, song)
                            }} checked={!song.excluded} id={`song-${index}`} type="checkbox" className="m-3"/>
                            <label className="w-full py-2" htmlFor={`song-${index}`}>{song.title}</label>
                        </div>
                    )
                })}
            </div>
            <p className="mt-4">Czy chcesz kontynuowa??? Ta operacja mo??e potrwa?? ponad {searchDuration()} sekund.</p>
            {searching &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify animate-spin" data-icon="mdi:loading"/>
                <span className="ml-2">Szukam... {searchProgress} / {props.songs.filter(song => !song.excluded).length}</span>
            </p>
            }
            {(!searching && props.spotifySongs?.tracks && props.spotifySongs.tracks.length) &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify" data-icon="mdi:check"/>
                <span className="ml-2">Znalaz??em ponad {props.spotifySongs.tracks.length} piosenek!</span>
            </p>
            }
            <div className="flex mt-2">
                <RButton onClick={searchSongs}>Szukaj</RButton>
                <div className="flex-grow"/>
                <RButton className="mr-2" onClick={props.onBackward}>Wstecz</RButton>
                <RButton disabled={!props.spotifySongs?.tracks.length} onClick={props.onForward}>Dalej</RButton>
            </div>
        </Card>
    )
}
export default Step4
