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

const Step4 = (props: {
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    songs: Song[],
    spotifySongs: {notFoundSongs: [], tracks: []},
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
            {(!searching && props.spotifySongs.tracks && props.spotifySongs.tracks.length) &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify" data-icon="mdi:check"/>
                <span className="ml-2">Znalazłem ponad {props.spotifySongs.tracks.length} piosenek!</span>
            </p>
            }
            <div className="flex">
                <button onClick={searchSongs} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Szukaj
                </button>
                <div className="flex-grow"/>
                <button onClick={props.onBackward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Wstecz
                </button>
                <button onClick={props.onForward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Dalej
                </button>
            </div>
        </div>
    )
}
export default Step4
