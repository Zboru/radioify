import React from 'react'
import Header from '../components/Header'

const Home = () => {
    return (
        <React.Fragment>
            <main>
                <div className="max-w-xl text-6xl font-medium ">
                    Przenieś swoje ulubione radio do playlisty Spotify!
                </div>
            </main>
            <button type="button"
                    className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 mr-3 mb-3">Zaloguj przez Spotify
            </button>
        </React.Fragment>
    );
};

export default Home
