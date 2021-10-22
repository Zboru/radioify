import axios from "axios";
import {RadioListResponse} from "../types";

export async function getRadiostationList() {
    const RADIOLIST_URL = "https://ods.lynx.re/radiolst.php";
    const response = await axios.get<RadioListResponse>(RADIOLIST_URL);
    return response.data.summary.flatMap(group => group.stations)
}
