import React, {ChangeEvent, createRef, MouseEventHandler, useEffect, useState} from "react";
import {spotifySongs} from "./Step4";
import Card from "../Card";
import clsx from "clsx";
import {useSessionStorage} from "../../../hooks/useSessionStorage";
import RButton from "../../general/RButton";
import {SpotifyPlaylistItem} from "../../../types";
import TextField from "../../general/TextField";
import {Song} from "./Step3";
import {addToPlaylist, createNewPlaylist, getPlaylists} from "../../../utils/spotify";

const Step5 = (props: {
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    spotifySongs: spotifySongs | null,
    songList: any,
}) => {
    const [spotifyToken, setTokens] = useSessionStorage('spotifyToken', null);
    const [selectedPlaylist, setSelectedPlaylist] = useState({});
    const [listState, toggleList] = useState(false);
    const [spotifyPlaylists, setPlaylists] = useState<SpotifyPlaylistItem[] | null>(null);
    const songListContainer = createRef<HTMLDivElement>();
    const [newPlaylistName, setPlaylistName] = useState("");

    function notFoundSongs() {
        return props.spotifySongs?.notFoundSongs || []
    }

    function syncPlaylist(e: React.MouseEvent) {
        const songsURIs = props.spotifySongs?.tracks.map(track => {
            return {uri: track.uri}
        }) ?? [];
        addToPlaylist(spotifyToken.token, selectedPlaylist, songsURIs)
            .then(response => {
                if (props.onForward) {
                    props.onForward(e)
                }
                console.log(response)
            })
    }

    function addNewPlaylist() {
        createNewPlaylist(spotifyToken.token, newPlaylistName).then(response => {
            if (spotifyPlaylists !== null) {
                setPlaylists([response, ...spotifyPlaylists])
            }
        })
    }

    function handleNewPlaylist(e: ChangeEvent<HTMLInputElement>) {
        setPlaylistName(e.currentTarget.value)
    }

    function getUserPlaylists() {
        getPlaylists(spotifyToken.token).then(response => {
            const userPlaylists = response.items.filter((playlist: { owner: { uri: string; }; }) => {
                return playlist.owner.uri === 'spotify:user:bonk-pl'
            })
            setPlaylists(userPlaylists);
        })
    }

    function notExcludedSongs() {
        return props.songList.filter((song: Song) => !song.excluded).length
    }

    useEffect(() => {
        getUserPlaylists();
    }, [])

    return (
        <Card active={props.active}>
            <p className="mb-2">Znaleziono ponad {props.spotifySongs?.tracks?.length} piosenek na Spotify
                z {notExcludedSongs()} granych w radiu.
                Poniżej jest lista piosenek, których nie udało się wyszukać:</p>
            <div ref={songListContainer}
                 className={clsx(listState ? 'h-56 border' : 'h-0', 'overflow-auto transition-height rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 w-100')}>
                {notFoundSongs().map((track, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:bg-gray-900 light:bg-white pl-4 pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <label className="w-full py-2" htmlFor={`song-${index}`}>{track.title}</label>
                        </div>
                    )
                })}
                {!notFoundSongs().length &&
                <div className="flex justify-center flex-col items-center h-full">
                    <span className="iconify text-4xl" data-icon="fluent:missing-metadata-16-regular"/>
                    <span>Lista jest pusta</span>
                </div>
                }
            </div>
            <RButton onClick={() => {
                toggleList(!listState)
            }} className="p-2 border rounded mt-2">
                {listState ? 'Schowaj listę' : 'Pokaż listę'}
            </RButton>
            <p className="mt-2">Wybierz playlistę z listy lub utwórz nową, aby dodać do niej znalezione utwory. W razie
                dodawania do
                istniejącej playlisty, duplikaty zostaną usunięte przed ich dodaniem.</p>
            <TextField onChange={handleNewPlaylist} className="my-2 md:w-1/2" placeholder={"Super playlista"}
                       label={"Nazwa playlisty"}/>
            <RButton disabled={newPlaylistName.length === 0} onClick={addNewPlaylist} className="mb-4">Utwórz</RButton>
            <div
                className={'overflow-auto h-56 transition-height rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 w-100'}>
                {spotifyPlaylists?.map((playlist, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:hover:bg-gray-700 dark:bg-gray-900 light:bg-white pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <input onChange={(event) => {
                                setSelectedPlaylist(playlist)
                            }} name='playlists' id={`playlist-${index}`} type="radio" className="m-3"/>
                            <label className="w-full py-2 cursor-pointer"
                                   htmlFor={`playlist-${index}`}>{playlist.name}</label>
                        </div>
                    )
                })}
            </div>
            <div className="flex">
                <div className="flex-grow"/>
                <button onClick={props.onBackward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Wstecz
                </button>
                <button onClick={syncPlaylist} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Dodaj!
                </button>
            </div>
        </Card>
    )
}
export default Step5;
