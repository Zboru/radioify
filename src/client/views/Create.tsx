import React, {useState} from "react"
import {useLocation} from "react-router-dom";
const Create = () => {
    const [spotifyMe, setMe] = useState({});
    const location = useLocation<Location>();
    const authCode = location?.search.replaceAll("?code=", "");
    return (
        <div>{JSON.stringify(spotifyMe)}</div>
    )
}
export default Create
