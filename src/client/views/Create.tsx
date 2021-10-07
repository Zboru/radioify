import React, {FormEvent, useState} from "react"
import Stepper from "../components/Stepper";
import Step from "../components/Step";
import Step1 from "../components/create/Step1";
import Step2 from "../components/create/Step2";
import Step3, {Song} from "../components/create/Step3";
import dayjs from "dayjs";
import Step4 from "../components/create/Step4";

export interface TimeRange {
    startDate: Date,
    startHour: number,
    endDate: Date,
    endHour: number,
}

export interface onDayChange extends Array<Date | object> {
    0: Date,
    1: object,
    2: object
}

const Create = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentStep, setStep] = useState(0);
    const [timeRange, setTimeRange] = useState<TimeRange>({
        startDate: dayjs().subtract(7,'days').toDate(),
        startHour: 10,
        endDate: new Date(),
        endHour: 15,
    });

    function moveForward() {
        if (currentStep < 4) {
            setStep(currentStep + 1);
        }
    }

    function moveBackward() {
        if (currentStep > 0) {
            setStep(currentStep - 1);
        }
    }

    function setStartDate(...args: onDayChange) {
        setTimeRange({...timeRange, startDate: args[0]})
    }

    function setEndDate(...args: onDayChange) {
        setTimeRange({...timeRange, endDate: args[0]})
    }

    function setStartHour(event: FormEvent<HTMLInputElement>) {
        setTimeRange({...timeRange, startHour: parseInt(event.currentTarget.value)})
    }

    function setEndHour(event: FormEvent<HTMLInputElement>) {
        console.log(event.currentTarget.value)
        setTimeRange({...timeRange, endHour: parseInt(event.currentTarget.value)})
    }

    return (
        <div>
            <Stepper className={'my-4'}>
                <Step title={"Krok 1"} active={currentStep === 0} description={"Wybierz radio"}/>
                <Step title={"Krok 2"} active={currentStep === 1} description={"Określ czas"}/>
                <Step title={"Krok 3"} active={currentStep === 2} description={"Pobierz piosenki"}/>
                <Step title={"Krok 4"} active={currentStep === 3} description={"Znajdź w Spotify"}/>
                <Step title={"Krok 5"} active={currentStep === 4} description={"Stwórz playlistę"}/>
            </Stepper>
            <Step1 active={currentStep === 0} onForward={moveForward}/>
            <Step2
                onStartDateChange={setStartDate}
                onStartHourChange={setStartHour}
                onEndDateChange={setEndDate}
                onEndHourChange={setEndHour}
                startDate={timeRange.startDate}
                endDate={timeRange.endDate}
                startHour={timeRange.startHour}
                endHour={timeRange.endHour}
                active={currentStep === 1}
                onForward={moveForward}
                onBackward={moveBackward}
            />
            <Step3
                songs={songs}
                setSongs={setSongs}
                timeRange={timeRange}
                active={currentStep === 2}
                onForward={moveForward}
                onBackward={moveBackward}
            />
            <Step4
                setSongs={setSongs}
                songs={songs}
                active={currentStep === 3}
                onForward={moveForward}
                onBackward={moveBackward}
            />
        </div>
    )
}
export default Create