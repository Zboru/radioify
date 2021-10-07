import React, {ChangeEvent, Dispatch, MouseEventHandler} from "react";
import clsx from "clsx";
import {Song} from "./Step3";
import TextField from "../TextField";

const Step4 = (props: {
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    songs: Song[],
    setSongs: Dispatch<Song[]>,
}) => {

    function toggleSong(event: ChangeEvent<HTMLInputElement>, song: Song) {
        const songs = [...props.songs];
        const songIndex = songs.indexOf(song);
        songs[songIndex].excluded = !event.currentTarget.checked
        props.setSongs(songs)
    }

    return (
        <div className={clsx(props.active ? 'visible' : 'hidden')}>
            <p>Sprawdź pobraną listę i zaznacz utwory, które mają zostać wyszukane w serwisie Spotify. Utwory odznaczone
                zostaną wykluczone z wyszukiwania oraz umieszczenia w playliście.</p>
            <div className="flex">
                <div className="flex-grow" />
                <TextField placeholder={"Szukaj utworu"}/>
            </div>
            <div className="overflow-auto border rounded no-scrollbar shadow-md border-gray-300 h-56 w-100">
                {props.songs && props.songs.map((song: Song, index) => {
                    return (
                        <div key={index} className="border-b border-gray-300 select-none">
                            <input onChange={(event) => {
                                toggleSong(event, song)
                            }} checked={!song.excluded} id={`song-${index}`} type="checkbox" className="m-3"/>
                            <label htmlFor={`song-${index}`}>{song.title}</label>
                        </div>
                    )
                })}
            </div>
            <p className="mt-4">Czy chcesz kontynuować? Ta operacja może potrwać trochę dłużej.</p>
            <div className="flex">
                <button onClick={props.onBackward} type="button"
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
