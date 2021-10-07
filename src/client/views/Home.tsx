import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import {createAuthorizeURL} from "../utils/spotify";
import {Link} from "react-router-dom";
import {SpotifyProfile, SpotifyProfileResponse} from "../types";

const spotifyLoginURL = createAuthorizeURL()

const Home = () => {
    const [spotifyProfile, setProfile] = useState<SpotifyProfile | null>(null);
    let history = useHistory();
    const [spotifyTokens, setTokens] = useState(() => {
        const saved = localStorage.getItem("spotify");
        if (saved != null) {
            return JSON.parse(saved);
        }
        return {}
    });
    if (JSON.stringify(spotifyTokens) !== "{}") {
        console.log("Saving tokens")
        localStorage.setItem('spotify', JSON.stringify(spotifyTokens));
    }
    const location = useLocation<Location>();
    const authCode = location?.search.replaceAll("?code=", "");
    if (authCode) {
        axios.post('/api/authorize', {code: authCode}).then((response) => {
            history.push('/')
            setTokens(response.data);
        })
    }
    if (spotifyTokens && JSON.stringify(spotifyProfile) === "{}") {
        axios.get<SpotifyProfileResponse>('/api/getProfile', {
            params: {
                code: spotifyTokens?.access_token
            }
        }).then(response => {
            console.log(response)
            console.debug(response.status)
            setProfile({
                name: response.data.body.display_name,
                image: response.data.body.images[0].url,
                uri: response.data.body.uri
            })
        }).catch(err => {
            console.debug(err);
        })
    }

    function spotifyProfileExists() {
        return spotifyProfile?.name !== "" ||
            spotifyProfile.image !== "" ||
            spotifyProfile.uri !== "";
    }

    useEffect(()=>{
        console.log(spotifyProfile)
        console.log(spotifyTokens)
        axios.get('/api/getProfile', {
            params: {
                code: spotifyTokens?.access_token
            }
        }).then(response => {
            console.log(response.data)
        })
    }, [])
    return (
        <div className="p-5">
            <div>
                <div
                    className="md:mt-12 bg-gradient-to-bl from-green-400 via-green-300 to-blue-200 bg-clip-text text-transparent max-w-xl text-4xl md:text-6xl font-medium">
                    Przenieś swoje ulubione radio do playlisty Spotify!
                </div>
                <div className="mt-4 w-3/4 dark:text-white text-xl font-regular">
                    Radioify pozwala ci w łatwy sposób utworzyć spersonalizowaną playlistę Spotify z piosenkami z
                    Twojego radia internetowego. <br/>To wszystko w kilku prostych krokach!
                </div>
            </div>
            {!spotifyProfileExists() &&
            <a href={spotifyLoginURL}>
                <button type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3">
                    <span className={"iconify text-xl mr-2"} data-icon={'fa:spotify'}/>
                    Zaloguj się przez Spotify
                </button>
            </a>
            }
            {spotifyProfileExists() &&
            <div className={'flex items-center dark:text-white'}>
                <img className={"w-10 h-10 rounded-full mr-2"} src={spotifyProfile?.image} alt=""/>
                <span>Zalogowany jako {spotifyProfile?.name}</span>
            </div>
            }
            <Link to='/app'>
                <button type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3">
                    <span className={"iconify text-xl mr-2"} data-icon={'fxemoji:saxophone'}/>
                    Przejdź do aplikacji
                </button>
            </Link>
        </div>
    );
};

export default Home