import React from "react"
import { Link } from 'react-router-dom'
import DarkModeSwitch from "../components/navigation/DarkModeSwitch";

const Layout = (props: { children: React.ReactNode }): JSX.Element => {
    return (
        <div className={"h-screen"}>
            <div className={'container'}>
                {/*Navigation*/}
                <div className={'flex items-center px-5 justify-between md:px-0 pt-2 dark:text-white border-b border-gray-700 pb-2'}>
                    <Link to="/">Radioify dla Spotify</Link>
                    <DarkModeSwitch/>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    )
}
export default Layout
