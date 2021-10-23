import React, {LegacyRef, MouseEventHandler} from "react";
import {createRef, useState} from "react";
import {useTranslation} from "react-i18next";

const LanguageSwitch = () => {
    const {i18n} = useTranslation()
    const menuBtnRef: LegacyRef<HTMLDivElement> = createRef();
    const [menuState, setState] = useState(false);

    function changeLanguage(e: any) {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <div ref={menuBtnRef} tabIndex={0} onBlur={() => setState(false)} className="relative flex items-center mr-2">
            <button onClick={() => setState(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900 dark:text-gray-200" fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
            </button>
            {menuState &&
            <div
                className="absolute w-32 top-10 bg-white dark:bg-gray-800 dark:border-gray-500 border shadow rounded flex flex-col">
                <button onMouseDown={changeLanguage} value="en"
                        className="px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 text-left transition">🇺🇸 English
                </button>
                <button onMouseDown={changeLanguage} value="pl"
                        className="px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 text-left transition">🇵🇱 Polski
                </button>
            </div>}
        </div>
    )
}
export default LanguageSwitch
