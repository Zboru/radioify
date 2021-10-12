import React, {ChangeEvent, createRef, MouseEventHandler, useState} from "react";
import clsx from "clsx";
import Fuse from "fuse.js";
import {spotifySongs} from "./Step4";


const Step5 = (props: {
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    spotifySongs: spotifySongs | null,
    songList: any
}) => {
    const [songFilter, setSongFilter] = useState<string | null>(null)
    const songListContainer = createRef<HTMLDivElement>();

    function handleFilterChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.currentTarget.value
        if (songListContainer.current) {
            songListContainer.current.scrollTop = 0;
        }
        setSongFilter(value);
    }

    function filteredSongs(filter: string | null) {
        if (props.spotifySongs !== null) {
            const options = {
                includeScore: true,
                keys: ['title'],
            }
            const fuse = new Fuse(props.spotifySongs.notFoundSongs, options)
            if (filter) {
                return fuse.search(filter).map(result => result.item);
            } else {
                return props.spotifySongs?.notFoundSongs
            }
        }
    }

    return (
        <div className={clsx(props.active ? 'visible' : 'hidden')}>
            <p className="mb-2">Znaleziono ponad {props.spotifySongs?.tracks?.length} piosenek na Spotify
                z {props.songList.length} granych w radiu.
                Poniżej jest lista piosenek, których nie udało się wyszukać:</p>
            <div ref={songListContainer}
                 className="overflow-auto border rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 h-56 w-100">
                {filteredSongs(songFilter)?.map((track, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:bg-gray-900 light:bg-white pl-4 pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <label className="w-full py-2" htmlFor={`song-${index}`}>{track.title}</label>
                        </div>
                    )
                })}
            </div>
            <button className="p-2 border rounded mt-2">Schowaj listę</button>
            <div className="flex">
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
export default Step5;
