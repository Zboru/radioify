import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
import {useSessionStorage} from "../hooks/useSessionStorage";
import clsx from "clsx";
import RButton from "../components/general/RButton";
import {createAuthorizationURL, getMe} from "../utils/spotify";

const Home = () => {
    let history = useHistory();
    const location = useLocation<Location>();
    const [dataLoading, setLoading] = useState(false);
    const [spotifyProfile, setProfile] = useSessionStorage('spoitfyProfile', null);
    const [spotifyToken, setToken] = useSessionStorage('spotifyToken', null)

    function loadProfile() {
        if (spotifyToken && spotifyProfile === null) {
            setLoading(true);
            getMe(spotifyToken.token).then(response => {
                setProfile(response);
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            })
        }
    }

    useEffect(() => {
        // Remove hash from response
        const locationString = location?.hash.replaceAll("#", "");
        const authObject = Object.fromEntries(new URLSearchParams(locationString));
        // Save access token with expiration date
        if (authObject.access_token) {
            const date = new Date()
            setToken({
                token: authObject.access_token,
                expires_in: date.setHours(date.getHours() + 1)
            });
            history.push('/')
        }
    }, [])

    useEffect(() => {
        loadProfile();
    }, [spotifyToken])

    function spotifyLogin() {
        window.location.href = createAuthorizationURL();
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
                <span>Zalogowany jako {spotifyProfile?.display_name}</span>
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
