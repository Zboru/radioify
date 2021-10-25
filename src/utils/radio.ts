import axios from "axios";
import {PlaylistResponse, RadioListResponse} from "../types";
import {getRadiostationTracks} from "../types";
import {chunk, range} from "./helpers";
import dayjs from "dayjs";

export let currentProgress = 0;

export async function getRadiostationList() {
    const RADIOLIST_URL = "https://ods.lynx.re/radiolst.php";
    const fetchURL = `https://api.allorigins.win/get?url=${encodeURIComponent(RADIOLIST_URL)}`;
    const response = await axios.get<RadioListResponse>(fetchURL).then(response => JSON.parse(response.data.contents));
    return response.summary.flatMap(group => group.stations)
}

async function getSongsFromDay(radioID: number, currentDate: string, startHour: number, endHour: number) {
    const PLAYLIST_URL = "https://ods.lynx.re/playlist.php";
    // The API allows you to download a maximum range of 10 hours,
    // so you need to split user range into chunks
    const hoursRange = range(startHour, endHour);
    const hoursChunk = chunk(hoursRange, 10).map(array => {
        return [array[0], array[array.length - 1]]
    });

    const songs: Set<string> = new Set();
    for await (let hours of hoursChunk) {
        // Modify hours so request is properly handled by API
        if (hours[1] === 24) {
            hours[1] = 0;
        }
        const formattedDate = dayjs(currentDate).format('DD-MM-YYYY')
        const fetchURL = `https://api.allorigins.win/get?url=${encodeURIComponent(`${PLAYLIST_URL}?r=${radioID}&date=${formattedDate}&time_from=${hours[0]}&time_to=${hours[1]}`)}`;
        const response = await axios.get<PlaylistResponse>(fetchURL).then(response => JSON.parse(response.data.contents));
        response.summary.forEach(song => songs.add(song.title))
    }
    currentProgress += 1;
    return Array.from(songs);
}

export async function getRadiostationTracks({radioID, startDate, endDate, startHour, endHour}: getRadiostationTracks) {
    currentProgress = 0;

    const startDateObj = dayjs(startDate);
    const endDateObj = dayjs(endDate);
    const totalDays = Math.abs(endDateObj.diff(startDateObj, 'days'));

    const promises = [];
    for (let i = 1; i <= totalDays; i++) {
        const currentDate = startDateObj.add(i, 'day').toString();
        promises.push(getSongsFromDay(radioID, currentDate, startHour, endHour));
    }

    // When all requests are completed, add songs to Set
    const results = await Promise.allSettled(promises)

    const songs: string[] = [];
    results.forEach(data => {
        if (data.status === 'fulfilled') {
            songs.push(...data.value);
        }
    })

    // Create unique array with all fetched songs
    const uniqueSongs = Array.from(new Set(songs));
    return uniqueSongs.map(song => {
        return {title: song, excluded: false}
    })
}

