import React from "react"
import DarkModeSwitch from "../components/navigation/DarkModeSwitch";

const Layout = (props: { children: React.ReactNode }): JSX.Element => {
    return (
        <div className={"h-screen bg-gray-200 dark:bg-red-300"}>
            <div className={'container'}>
                {/*Navigation*/}
                <div className={'flex justify-between pt-2'}>
                    Radioify dla Spotify
                    <DarkModeSwitch/>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    )
}
export default Layout
