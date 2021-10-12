import React, {MouseEventHandler} from "react"
import clsx from "clsx";

const buttonClasses = ['rounded-lg border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700']

const RButton = (props: {
    className?: string,
    children: string,
    icon?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
}) => {
    return (
        <button type="button" onClick={props.onClick} className={clsx(props.className, buttonClasses)}>
            <span className="iconify text-xl mr-2" data-icon={props.icon}/>
            {props.children}
        </button>
    )
}
export default RButton
