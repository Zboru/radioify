import {getTrackBackground, Range} from "react-range";
import React from "react";

const MIN = 0;
const MAX = 24;

const TimeSlider = (props: {
    startHour: number,
    endHour: number,
    onChange: any,
}) => {
    const [values, setValues] = React.useState([props.startHour, props.endHour]);
    return (
        <>
            <p className="mb-8">Przedział czasowy dnia</p>
            <Range
                values={values}
                onChange={(values) => {
                    setValues(values)
                    props.onChange(values);
                }}
                min={0}
                max={24}
                step={1}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: '5px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values,
                                    colors: ['#ccc', '#219f43', '#ccc'],
                                    min: MIN,
                                    max: MAX,
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ index, props, isDragged }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '15px',
                            width: '15px',
                            borderRadius: '50%',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-35px',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                padding: '5px',
                                width:'30px',
                                textAlign:"center",
                                borderRadius: '4px',
                                backgroundColor: '#219f43'
                            }}
                        >
                            {values[index].toFixed(0)}
                        </div>
                    </div>
                )}
            />
        </>
    )
}
export default TimeSlider
