import React, {FormEvent, useState} from "react"
import Stepper from "../components/create/Stepper";
import Step from "../components/create/Step";
import Step1 from "../components/create/steps/Step1";
import Step2 from "../components/create/steps/Step2";
import Step3, {Song} from "../components/create/steps/Step3";
import dayjs from "dayjs";
import Step4, {spotifySongs} from "../components/create/steps/Step4";
import Step5 from "../components/create/steps/Step5";
import {StationResponse} from "../types";
import Step6 from "../components/create/steps/Step6";

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
    const [selectedRadio, selectRadio] = useState<StationResponse | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [spotifySongs, setSpotifySongs] = useState<spotifySongs | null>(null);
    const [currentStep, setStep] = useState(0);
    const [timeRange, setTimeRange] = useState<TimeRange>({
        startDate: dayjs().subtract(7, 'days').toDate(),
        startHour: 10,
        endDate: new Date(),
        endHour: 15,
    });

    function moveForward() {
        if (currentStep < 5) {
            setStep(currentStep + 1);
        }
    }

    function moveBackward() {
        if (currentStep > 0) {
            setStep(currentStep - 1);
        }
    }

    function handleSelectRadio(radio: any) {
        selectRadio(radio);
    }

    function setStartDate(...args: onDayChange) {
        setTimeRange({...timeRange, startDate: args[0]})
    }

    function setEndDate(...args: onDayChange) {
        setTimeRange({...timeRange, endDate: args[0]})
    }

    function StepMobileVisible(index: number) {
        return Math.abs(currentStep - index) < 2 || index == 2;
    }

    function setHours(hours: number[]) {
        setTimeRange({...timeRange, startHour: hours[0], endHour: hours[1]})
    }

    return (
        <div className="flex flex-col h-full">
            <Stepper className={'my-4 px-4 sm:p-0'}>
                <Step title={"Krok 1"} mobileVisible={StepMobileVisible(0)} active={currentStep === 0}
                      description={"Wybierz radio"}/>
                <Step title={"Krok 2"} mobileVisible={StepMobileVisible(1)} active={currentStep === 1}
                      description={"Określ czas"}/>
                <Step title={"Krok 3"} mobileVisible={StepMobileVisible(2)} active={currentStep === 2}
                      description={"Pobierz piosenki"}/>
                <Step title={"Krok 4"} mobileVisible={StepMobileVisible(3)} active={currentStep === 3}
                      description={"Znajdź w Spotify"}/>
                <Step title={"Krok 5"} mobileVisible={StepMobileVisible(4)} active={currentStep === 4}
                      description={"Stwórz playlistę"}/>
            </Stepper>
            <div className="flex flex-grow">
                <Step1
                    selectedRadio={selectedRadio}
                    selectRadio={handleSelectRadio}
                    active={currentStep === 0}
                    onForward={moveForward}
                />
                <Step2
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onHoursChange={setHours}
                    startDate={timeRange.startDate}
                    endDate={timeRange.endDate}
                    startHour={timeRange.startHour}
                    endHour={timeRange.endHour}
                    active={currentStep === 1}
                    onForward={moveForward}
                    onBackward={moveBackward}
                />
                <Step3
                    selectedRadio={selectedRadio}
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
                    spotifySongs={spotifySongs}
                    setSpotifySongs={setSpotifySongs}
                    active={currentStep === 3}
                    onForward={moveForward}
                    onBackward={moveBackward}
                />
                <Step5
                    spotifySongs={spotifySongs}
                    active={currentStep === 4}
                    onForward={moveForward}
                    onBackward={moveBackward}
                    songList={songs}
                />
                <Step6
                    active={currentStep === 5}
                />
            </div>
        </div>
    )
}
export default Create
