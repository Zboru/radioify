import {chunk, range} from "./utils";
import dayjs, {Dayjs} from "dayjs";
import axios from "axios";
import {PlaylistResponse} from "../types";

const PLAYLIST_URL = "https://ods.lynx.re/playlist.php";

export let currentProgress = 0;

export async function getSongsFromDay(radioID: number, currentDate: Dayjs, startHour: number, endHour: number) {
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
        const {data} = await axios.get<PlaylistResponse>(`${PLAYLIST_URL}?r=${radioID}&date=${formattedDate}&time_from=${hours[0]}&time_to=${hours[1]}`);
        data.summary.forEach(song => songs.add(song.title))
    }
    currentProgress += 1;
    return Array.from(songs);
}

// Get song list from day span
export async function getSongsFromDateSpan(radioID: number, startDate: Dayjs, endDate: Dayjs, startHour: number, endHour: number) {
    currentProgress = 0;

    const totalDays: number = Math.abs(endDate.diff(startDate, 'days'));

    const promises = [];
    for (let i = 1; i <= totalDays; i++) {
        const currentDate = startDate.add(i, 'day');
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
        return {title: song}
    })
}
