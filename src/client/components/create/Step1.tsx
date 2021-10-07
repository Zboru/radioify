import React, {MouseEventHandler, useEffect, useState} from "react";
import axios from "axios";
import {RadioListGroup, RadioListResponse} from "../../types";

const Step1 = (props: ({
    onForward?: MouseEventHandler,
    active: boolean
})) => {
    const [radioList, setRadiolist] = useState<RadioListGroup[] | null>(() => {
        const savedList = sessionStorage.getItem("radioList");
        if (savedList != null) {
            return JSON.parse(savedList);
        }
        return null
    });
    useEffect(() => {
        if (!radioList?.length) {
            axios.get<RadioListResponse>("//ods.lynx.re/radiolst.php").then((response) => {
                sessionStorage.setItem('radioList', JSON.stringify(response.data.summary))
                setRadiolist(response.data.summary)
            })
        }
    }, [])

    return (
        <div className={props.active ? 'visible' : 'hidden'}>
            <p>Skorzystaj z wyszukiwarki, aby wybrać radio, z którego mają być pobrane piosenki. Lista stacji radiowych jest dostarczana przez
                serwis&nbsp;<a className="underline" href="https://odsluchane.eu" target="_blank">odSluchane.eu</a>.</p>
            <select className='mt-2 border p-2 rounded'>
                {radioList && radioList.map(list => {
                    return (
                        <optgroup key={list.groupName} label={list.groupName}>
                            {list.stations && list.stations.map(station => {
                                return (<option key={station.id} value={station.id}>{station.name}</option>)
                            })}
                        </optgroup>
                    )
                })}
            </select>
            <div className="flex">
                <div className="flex-grow" />
                <button onClick={props.onForward} type="button"
                        className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3"
                >Dalej
                </button>
            </div>
        </div>
    )
}
export default Step1
