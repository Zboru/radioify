import React, {ChangeEventHandler} from "react"

const TextField = (props: {
    label?: string,
    placeholder: string,
    onChange?: ChangeEventHandler<HTMLInputElement>
}) => {
    const randomID = `id-${Math.floor(Math.random() * 8096)}`;

    return (
        <React.Fragment>
            <label className="flex flex-col text-gray-600 dark:text-gray-200" htmlFor={randomID}>
                <span className="text-sm select-none">{props.label}</span>
                <input onChange={props.onChange} placeholder={props.placeholder} id={randomID} className="border p-2 rounded" type="text"/>
            </label>
        </React.Fragment>
    )
}
export default TextField
