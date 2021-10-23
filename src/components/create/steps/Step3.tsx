import React, {Dispatch, MouseEventHandler, useEffect, useState} from "react";
import {TimeRange} from "../../../views/Create";
import dayjs from "dayjs";
import {StationResponse} from "../../../types";
import RButton from "../../general/RButton";
import Card from "../Card";
import {currentProgress} from "../../../utils/radio";
import {getRadiostationTracks} from "../../../utils/radio";

export interface Song {
    title: string,
    excluded: boolean
}

const Step3 = (props: {
    timeRange: TimeRange,
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    selectedRadio: StationResponse | null,
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
        const startDate = dayjs(props.timeRange.startDate).format('YYYY-MM-DD');
        const endDate = dayjs(props.timeRange.endDate).format('YYYY-MM-DD');
        const radioID = props.selectedRadio?.id ?? 1;
        getRadiostationTracks({
            radioID,
            startDate,
            endDate,
            startHour: props.timeRange.startHour,
            endHour: props.timeRange.endHour
        }).then(response => {
            props.setSongs(response);
            setSearching(false);
        })
    }

    return (
        <Card active={props.active}>
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
            <div className="flex mt-2">
                <RButton onClick={startSearch}>Szukaj</RButton>
                <div className="flex-grow"/>
                <RButton className="mr-2" onClick={props.onBackward}>Wstecz</RButton>
                <RButton disabled={!props.songs.length} onClick={props.onForward}>Dalej</RButton>
            </div>
        </Card>
    )
}
export default Step3
