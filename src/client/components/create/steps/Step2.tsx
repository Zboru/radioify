import React, {MouseEventHandler} from "react"
import clsx from "clsx";
import {MONTHS, WEEKDAYS_SHORT} from "../../../utils/day-picker";
import DPI from 'react-day-picker/DayPickerInput';
// @ts-ignore
const DayPickerInput = DPI.__esModule ? DPI.default : DPI
import 'react-day-picker/lib/style.css';
import RButton from "../../general/RButton";
import TimeSlider from "../TimeSlider";

const Step2 = (props: {
    onStartDateChange?: any,
    onEndDateChange?: any,
    onStartHourChange?: any,
    onEndHourChange?: any,
    startHour: number,
    endHour: number,
    startDate?: Date,
    endDate?: Date,
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean,
    onHoursChange: any
}) => {
    return (
        <div className={clsx(props.active ? 'visible' : 'hidden', 'font-regular shadow p-4 bg-white dark:bg-gray-800 rounded')}>
            <p>Ustal przedział czasowy, z którego aplikacja ma wyszukać piosenki. Godziny określają porę dnia, w której
                pobierane są piosenki, czyli aplikacja wyszuka piosenki z każdego
                dnia pomiędzy tymi godzinami.
            </p>
            <div className="flex flex-cols sm:flex-row mt-4">
                <label className="flex flex-col" htmlFor="">
                    Data początkowa
                    <DayPickerInput
                        onDayChange={props.onStartDateChange}
                        dayPickerProps={{weekdaysShort: WEEKDAYS_SHORT, months: MONTHS}}
                        value={props.startDate}
                        inputProps={{readOnly: true, className: 'border h-10 p-2 rounded'}}
                        placeholder={"YYYY-MM-DD"}
                    />
                </label>
            </div>
            <div className="flex flex-col sm:flex-row mt-2">
                <label className="flex flex-col" htmlFor="">
                    Data końcowa
                    <DayPickerInput
                        onDayChange={props.onEndDateChange}
                        dayPickerProps={{weekdaysShort: WEEKDAYS_SHORT, months: MONTHS}}
                        value={props.endDate}
                        inputProps={{readOnly: true, className: 'border p-2 h-10 rounded leading-normal'}}
                        placeholder={"YYYY-MM-DD"}
                    />
                </label>
            </div>
            <div className="w-64 mt-2">
                <TimeSlider onChange={props.onHoursChange} startHour={props.startHour} endHour={props.endHour}/>
            </div>
            <div className="flex">
                <div className="flex-grow"/>
                <RButton className="mr-2" onClick={props.onBackward}>Wstecz</RButton>
                <RButton onClick={props.onForward}>Dalej</RButton>
            </div>
        </div>
    )
}
export default Step2
