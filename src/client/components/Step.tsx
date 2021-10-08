import React from "react";
import clsx from "clsx";

export interface StepProps {
    title: string,
    description: string
    active?: boolean,
    mobileVisible?: boolean
}

const Step = (props: StepProps) => {
    const stepClasses = [
        "border-t-4 pt-4 transition sm:visible",
        {'border-green-600': props.active},
        {'border-gray-200': !props.active},
        {'visible': props.mobileVisible},
        {'hidden': !props.mobileVisible},
    ];
    const titleClasses = [
        "uppercase font-bold",
        {'text-green-600': props.active},
        {'text-gray-400': !props.active},
    ]
    return (
        <div className={clsx(stepClasses)}>
            <p className={clsx(titleClasses)}>{props.title}</p>
            <p className="font-semibold">{props.description}</p>
        </div>
    )
}
export default Step
