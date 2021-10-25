import React, {MouseEventHandler, useEffect} from "react";
import RButton from "../../general/RButton";
import Card from "../Card";
import {useSessionStorage} from "../../../hooks/useSessionStorage";
import {getRadiostationList} from "../../../utils/radio";
import Select from "react-select";

const Step1 = (props: ({
    onForward?: MouseEventHandler,
    active: boolean,
    selectRadio: any,
    selectedRadio: any,
})) => {
    const [radioList, setRadiolist] = useSessionStorage('radioList', [])

    useEffect(() => {
        if (!radioList?.length) {
            getRadiostationList().then(response => {
                const radioMap = response.map((station: { name: string; id: number; }) => {
                    return {label: station.name, value: station.id}
                })
                setRadiolist(radioMap);
            })
        }
    }, [])

    return (
        <Card active={props.active}>
            <p>Skorzystaj z wyszukiwarki, aby wybrać radio, z którego mają być pobrane piosenki. Lista stacji radiowych
                jest dostarczana przez
                serwis&nbsp;<a className="underline" href="https://odsluchane.eu" target="_blank">odSluchane.eu</a>.</p>
            <label htmlFor="radioSelect">
                <span className="text-sm select-none text-gray-600 dark:text-gray-200">Wyszukaj radio</span>
                <Select options={radioList} onChange={props.selectRadio} inputId='radioSelect' placeholder={"Eska"}/>
            </label>
            <div className="flex">
                <div className="flex-grow"/>
                <RButton disabled={!props.selectedRadio} className="mt-2" onClick={props.onForward}>Dalej</RButton>
            </div>
        </Card>
    )
}
export default Step1
