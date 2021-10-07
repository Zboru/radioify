import React, {MouseEventHandler} from "react"
import 'react-day-picker/lib/style.css';
import DayPickerInput from "react-day-picker/DayPickerInput";
import clsx from "clsx";

const Step2 = (props: {
    onStartDateChange: any,
    onEndDateChange: any,
    onStartHourChange: any,
    onEndHourChange: any,
    startHour: number,
    endHour: number,
    startDate: Date,
    endDate: Date,
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
            <div className="flex mt-4">
                <label className="flex flex-col" htmlFor="">
                    Data początkowa
                    <DayPickerInput
                        onDayChange={props.onStartDateChange}
                        value={props.startDate}
                        inputProps={{className: 'border p-2 rounded'}}
                        placeholder={"YYYY-MM-DD"}
                    />
                </label>
                <label className="flex flex-col" htmlFor="">
                    Godzina początkowa
                    <select value={props.startHour} onChange={props.onStartHourChange} className='border p-2.5 rounded' name="" id="">
                        {Array.from({length: 25}).map((_, i) => {
                            return <option key={i} value={i}>{i}</option>
                        })}
                    </select>
                </label>
            </div>
            <div className="flex">
                <label className="flex flex-col" htmlFor="">
                    Data końcowa
                    <DayPickerInput
                        onDayChange={props.onEndDateChange}
                        value={props.endDate}
                        inputProps={{className: 'border p-2 rounded'}}
                        placeholder={"YYYY-MM-DD"}
                    />
                </label>
                <label className="flex flex-col" htmlFor="">
                    Godzina końcowa
                    <select value={props.endHour} onChange={props.onEndHourChange} className='border p-2.5 rounded' name="" id="">
                        {Array.from({length: 25}).map((_, i) => {
                            return <option key={i} value={i}>{i}</option>
                        })}
                    </select>
                </label>
            </div>
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
export default Step2
