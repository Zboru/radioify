import React, {
    ChangeEvent,
    ChangeEventHandler,
    createRef,
    Dispatch,
    MouseEventHandler,
    useEffect,
    useState
} from "react";
import clsx from "clsx";
import {Song} from "./Step3";
import TextField from "../TextField";
import Fuse from "fuse.js";
import axios from "axios";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import {SpotifyTrack} from "../../types";
import RButton from "../RButton";

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
    const [spotifyTokens, setTokens] = useLocalStorage('spotify', null);
    const songListContainer = createRef<HTMLDivElement>();

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
    const fuse = new Fuse(props.songs,options)

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
        performance.mark('search')
        setSearching(true)
        axios.post('http://localhost:4444/api/searchSongs', {tokens: spotifyTokens,songs: props.songs}).then(response => {
            props.setSpotifySongs(response.data);
            setSearching(false)
            performance.measure('searchMeasure', 'search');
            console.log(performance.getEntriesByType("measure"));
            performance.clearMarks();
            performance.clearMeasures();
        })
    }

    return (
        <div className={clsx(props.active ? 'visible' : 'hidden')}>
            <p>Sprawdź pobraną listę i zaznacz utwory, które mają zostać wyszukane w serwisie Spotify. Utwory odznaczone
                zostaną wykluczone z wyszukiwania oraz umieszczenia w playliście.</p>
            <div className="flex">
                <div className="flex-grow" />
                <TextField onChange={handleFilterChange} placeholder={"Wyszukaj utwór"}/>
            </div>
            <div ref={songListContainer} className="overflow-auto border rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 h-56 w-100">
                {filteredSongs(songFilter).map((song: Song, index) => {
                    return (
                        <div key={index} className="flex items-center dark:bg-gray-900 bg-white pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <input onChange={(event) => {
                                toggleSong(event, song)
                            }} checked={!song.excluded} id={`song-${index}`} type="checkbox" className="m-3"/>
                            <label className="w-full py-2" htmlFor={`song-${index}`}>{song.title}</label>
                        </div>
                    )
                })}
            </div>
            <p className="mt-4">Czy chcesz kontynuować? Ta operacja może potrwać ponad {searchDuration()} sekund.</p>
            {searching &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify animate-spin" data-icon="mdi:loading"/>
                <span className="ml-2">Szukam...</span>
            </p>
            }
            {(!searching && props.spotifySongs?.tracks && props.spotifySongs.tracks.length) &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify" data-icon="mdi:check"/>
                <span className="ml-2">Znalazłem ponad {props.spotifySongs.tracks.length} piosenek!</span>
            </p>
            }
            <div className="flex">
                <RButton onClick={searchSongs}>Szukaj</RButton>
                <div className="flex-grow"/>
                <RButton className="mr-2" onClick={props.onBackward}>Wstecz</RButton>
                <RButton disabled={!props.spotifySongs?.tracks.length} onClick={props.onForward}>Dalej</RButton>
            </div>
        </div>
    )
}
export default Step4
