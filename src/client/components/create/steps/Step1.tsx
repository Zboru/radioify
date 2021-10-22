import React, {MouseEventHandler, useEffect, useState} from "react";
import axios from "axios";
import RAutocomplete from "../../general/RAutocomplete";
import RButton from "../../general/RButton";
import Card from "../Card";
import {useSessionStorage} from "../../../hooks/useSessionStorage";

const Step1 = (props: ({
    onForward?: MouseEventHandler,
    active: boolean,
    selectRadio: any,
    selectedRadio: any,
})) => {
    const [radioList, setRadiolist] = useSessionStorage('radioList', [])

    useEffect(() => {
        if (!radioList?.length) {
            axios.get(import.meta.env.VITE_API_URL + '/api/radiolist').then(response => {
                setRadiolist(response.data);
            })
        }
    }, [])

    return (
        <Card active={props.active}>
            <p>Skorzystaj z wyszukiwarki, aby wybrać radio, z którego mają być pobrane piosenki. Lista stacji radiowych jest dostarczana przez
                serwis&nbsp;<a className="underline" href="https://odsluchane.eu" target="_blank">odSluchane.eu</a>.</p>
            <RAutocomplete
                searchBy="name"
                display="name"
                items={radioList}
                label={'Wyszukaj radio'}
                onSelect={props.selectRadio}
                placeholder={'Antyradio'}
            />
            <div className="flex">
                <div className="flex-grow" />
                <RButton disabled={!props.selectedRadio} className="mt-2" onClick={props.onForward}>Dalej</RButton>
            </div>
        </Card>
    )
}
export default Step1
