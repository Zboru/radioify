import React, {ChangeEventHandler, FocusEventHandler, KeyboardEventHandler} from "react"
import clsx from "clsx";

const TextField = (props: {
    label?: string,
    placeholder: string,
    value?: string,
    className?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>
    onFocus?: FocusEventHandler<HTMLInputElement>
    onBlur?: FocusEventHandler<HTMLInputElement>
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}) => {
    const randomID = `id-${Math.floor(Math.random() * 8096)}`;

    return (
        <React.Fragment>
            <label className={clsx("flex flex-col text-gray-600 dark:text-gray-200", props.className)} htmlFor={randomID}>
                <span className="text-sm select-none">{props.label}</span>
                <input value={props.value} onKeyDown={props.onKeyDown} onBlur={props.onBlur} onFocus={props.onFocus} onChange={props.onChange} placeholder={props.placeholder} id={randomID} className="border dark:border-gray-700 p-2 dark:bg-gray-900 dark:text-white rounded" type="text"/>
            </label>
        </React.Fragment>
    )
}
export default TextField
