import React, {MouseEventHandler} from "react";
import clsx from "clsx";

const Step4 = (props: {
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean
}) => {
    return (
        <div className={clsx(props.active ? 'visible' : 'hidden')}>
            <p>Sprawdź pobraną listę i zaznacz utwory, które mają zostać wyszukane w serwisie Spotify. Utwory odznaczone
                zostaną wykluczone z wyszukiwania oraz umieszczenia w playliście.</p>
            <div className="overflow-auto border h-56 w-100 mt-2">
                <div className="w-100 border-red-600 border h-10" />
                <div className="w-100 border-red-600 border h-10" />
                <div className="w-100 border-red-600 border h-10" />
            </div>
            <p>Czy chcesz kontynuować? Ta operacja może potrwać trochę dłużej.</p>
            <div className="flex">
                <div className="flex-grow" />
                <button onClick={props.onBackward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Wstecz
                </button>
                <button onClick={props.onForward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Dalej
                </button>
            </div>
        </div>
    )
}
export default Step4
