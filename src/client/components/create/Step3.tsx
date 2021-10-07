import React, {Dispatch, MouseEventHandler, useEffect, useState} from "react";
import clsx from "clsx";
import {TimeRange} from "../../views/Create";
import dayjs from "dayjs";
import {currentProgress, getSongsFromDateSpan} from "../../utils/radio";

export interface Song {
    title: string,
    excluded: boolean
}

const Step3 = (props: {
    timeRange: TimeRange,
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    songs: Song[],
    setSongs: Dispatch<Song[]>,
}) => {
    const [searching, setSearching] = useState(false);
    const [searchProgress, setSearchProgress] = useState(0);
    useEffect(()=>{
        setInterval(()=>{
            setSearchProgress(currentProgress)
        }, 200);
    }, []);

    function getTotalDays() {
        const startDate = dayjs(props.timeRange.startDate);
        const endDate = dayjs(props.timeRange.endDate);
        return endDate.diff(startDate, 'day');
    }

    function getTotalHours() {
        const hours = props.timeRange.endHour - props.timeRange.startHour;
        return hours * getTotalDays();
    }

    function startSearch() {
        setSearching(true);
        const startDate = dayjs(props.timeRange.startDate);
        const endDate = dayjs(props.timeRange.endDate);
        getSongsFromDateSpan(1, startDate, endDate, props.timeRange.startHour, props.timeRange.endHour)
            .then((songs) => {
                props.setSongs(songs);
                setSearching(false);
            });
    }

    return (
        <div className={clsx(props.active ? 'visible' : 'hidden', 'font-regular')}>
            <p>Aplikacja wyszuka teraz wszystkie piosenki, które były grane w danym okresie. Wybrano
                łącznie {getTotalDays()} dni, czyli dokładnie {getTotalHours()} godzin licząc z ustalonego przedziału.
            </p>
            <p className="mt-2">Czy chcesz kontynuować?</p>
            {searching &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify animate-spin" data-icon="mdi:loading"/>
                <span className="ml-2">Szukam... {searchProgress} / {getTotalDays()} dni</span>
            </p>
            }
            {!searching && props.songs && !!props.songs.length &&
            <p className="text-gray-500 italic flex items-center">
                <span className="iconify" data-icon="mdi:check"/>
                <span className="ml-2">Znalazłem ponad {props.songs.length} piosenek!</span>
            </p>
            }
            <div className="flex">
                <button onClick={startSearch} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Szukaj
                </button>
                <div className="flex-grow" />
                <button onClick={props.onBackward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Wstecz
                </button>
                <button disabled={!props.songs.length} onClick={props.onForward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Dalej
                </button>
            </div>
        </div>
    )
}
export default Step3
