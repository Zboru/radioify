import React from "react";
import clsx from "clsx";

export interface StepProps {
    title: string,
    description: string
    active?: boolean
}

const Step = (props: StepProps) => {
    const stepClasses = [
        "border-t-4 pt-4",
        {'border-purple-500': props.active},
        {'border-gray-200': !props.active},
    ];
    const titleClasses = [
        "uppercase font-bold",
        {'text-purple-500': props.active},
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
