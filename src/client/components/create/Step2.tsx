import React, {MouseEventHandler} from "react"
import clsx from "clsx";
import {MONTHS, WEEKDAYS_SHORT} from "../../utils/day-picker";
import DPI from 'react-day-picker/DayPickerInput';
// @ts-ignore
const DayPickerInput = DPI.__esModule ? DPI.default : DPI
import 'react-day-picker/lib/style.css';

const Step2 = (props: {
    onStartDateChange?: any,
    onEndDateChange?: any,
    onStartHourChange?: any,
    onEndHourChange?: any,
    startHour?: number,
    endHour?: number,
    startDate?: Date,
    endDate?: Date,
    onForward?: MouseEventHandler,
    onBackward?: MouseEventHandler,
    active: boolean
}) => {
    return (
        <div className={clsx(props.active ? 'visible' : 'hidden', 'font-regular')}>
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
                <label className="flex flex-col sm:ml-2" htmlFor="startHour">
                    Godzina początkowa
                    <input id="startHour" type="number" value={props.startHour} onChange={props.onStartHourChange} className="border h-10 p-2.5 rounded w-3/5" max={24} min={0}/>
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
                <label className="flex flex-col sm:ml-2" htmlFor="endHour">
                    Godzina końcowa
                    <input id="endHour" type="number" value={props.endHour} onChange={props.onEndHourChange}
                           className="border h-10 p-2.5 rounded w-3/5" max={24} min={0}/>
                </label>
            </div>
            <div className="flex">
                <div className="flex-grow"/>
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
export default Step2
