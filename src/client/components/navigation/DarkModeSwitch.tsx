import React, {useState} from "react"
import clsx from "clsx";

const switchContainerClasses = ["w-14 h-7 flex transition items-center rounded-full mx-3 px-1"]
const switchBallClasses = ["bg-white w-5 h-5 rounded-full transition shadow-md transform"];

const DarkModeSwitch = () => {

    const toggleMode = () => {
        setChecked(!checked);
        document.querySelector('html')?.classList.toggle('dark');
    }

    const [checked, setChecked] = useState(false);
    return (
        <div className={"flex items-center"}>
            <span className={clsx({'text-gray-900': !checked, 'text-gray-500': checked})}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            </span>
            <label htmlFor="checkbox" className={"cursor-pointer"}>
                <input onChange={toggleMode} type="checkbox" name={"checkbox"} id={"checkbox"} className={"hidden"}/>
                <div className={clsx(switchContainerClasses, {'bg-gray-700': checked, 'bg-gray-300': !checked})}>
                    <div className={clsx(switchBallClasses, {'translate-x-7': checked})}/>
                </div>
            </label>
            <span className={clsx({'text-gray-200': checked, 'text-gray-400': !checked})}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
            </span>
        </div>
    )
}
export default DarkModeSwitch
