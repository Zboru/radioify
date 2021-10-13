import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import {Link} from "react-router-dom";
import {SpotifyProfile} from "../types";
import {useLocalStorage} from "../hooks/useLocalStorage";
import clsx from "clsx";
import RButton from "../components/general/RButton";

const Home = () => {
    let history = useHistory();
    const location = useLocation<Location>();
    const [dataLoading, setLoading] = useState(false);
    const [spotifyProfile, setProfile] = useLocalStorage('spoitfyProfile',null);
    const [spotifyTokens, setTokens] = useLocalStorage('spotify', null)

    function loadProfile() {
        if (spotifyTokens && spotifyProfile === null) {
            setLoading(true)
            axios.get<SpotifyProfile>(import.meta.env.VITE_API_URL + "/api/getProfile", {
                params: {
                    accessToken: spotifyTokens?.access_token,
                    refreshToken: spotifyTokens?.refresh_token
                }
            }).then(response => {
                setProfile(response.data);
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            })
        }
    }

    useEffect(()=>{
        const authCode = location?.search.replaceAll(/(\?code=)|(&state.+)/g, "");
        if (authCode) {
            axios.post(import.meta.env.VITE_API_URL + "/api/authorize", {code: authCode}).then((response) => {
                setTokens(response.data);
                history.push('/')
            })
        }
    },[])

    useEffect(() => {
        loadProfile();
    }, [spotifyTokens])

    function spotifyLogin() {
        axios.get(import.meta.env.VITE_API_URL + '/api/login').then(response => {
            window.location = response.data;
        })
    }

    function spotifyProfileExists() {
        return spotifyProfile !== null
    }

    return (
        <div className="p-5">
            <div className="mb-2">
                <div
                    className="md:mt-12 bg-gradient-to-bl from-green-400 via-green-300 to-blue-200 bg-clip-text text-transparent max-w-xl text-4xl md:text-6xl font-medium">
                    Przenieś swoje ulubione radio do playlisty Spotify!
                </div>
                <div className="mt-4 w-3/4 dark:text-white text-xl font-regular">
                    Radioify pozwala ci w łatwy sposób utworzyć spersonalizowaną playlistę Spotify z piosenkami z
                    Twojego radia internetowego. <br/>To wszystko w kilku prostych krokach!
                </div>
            </div>
            {dataLoading &&
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full mr-2 animate-pulse bg-gray-200"/>
                <div className="h-5 w-64 bg-gray-200 ml-2 animate-pulse rounded-lg"/>
            </div>
            }
            {(!spotifyProfileExists() && !dataLoading) &&
            <button onClick={spotifyLogin} type="button"
                    className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3">
                <span className={"iconify text-xl mr-2"} data-icon={'fa:spotify'}/>
                Zaloguj się przez Spotify
            </button>
            }
            {spotifyProfileExists() &&
            <div className={clsx('flex items-center dark:text-white', {
                'hidden': dataLoading,
                'visible': !dataLoading
            })}>
                <img className={"w-10 h-10 rounded-full mr-2"} src={spotifyProfile?.image} alt=""/>
                <span>Zalogowany jako {spotifyProfile?.name}</span>
            </div>
            }
            {spotifyProfileExists() &&
            <p className="inline-block">
                <Link to='/app'>
                    <RButton className="mt-4" icon={'fxemoji:saxophone'}>Przejdź do aplikacji</RButton>
                </Link>
            </p>
            }
        </div>
    );
};

export default Home
