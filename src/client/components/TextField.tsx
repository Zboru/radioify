import React from "react"

const TextField = (props: {
    label?: string,
    placeholder: string
}) => {
    const randomID = `id-${Math.floor(Math.random() * 8096)}`;

    return (
        <React.Fragment>
            <label className="flex flex-col text-gray-600 dark:text-gray-200" htmlFor={randomID}>
                <span className="text-sm select-none">{props.label}</span>
                <input placeholder={props.placeholder} id={randomID} className="border p-2 rounded" type="text"/>
            </label>
        </React.Fragment>
    )
}
export default TextField