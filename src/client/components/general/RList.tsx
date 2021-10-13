import React, {useState} from "react"
import clsx from "clsx";

interface IProps {
    open?: boolean,
    display: string,
    items: any[]
}

const RList = ({open, items, display}: IProps) => {
    const [listState, toggleList] = useState(open || true);
    return (
        <div
            className={clsx(listState ? 'h-56 border' : 'h-0', 'overflow-auto transition-height rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 w-100')}>
            {items?.map((item, index) => {
                return (
                    <div key={index}
                         className="flex items-center dark:bg-gray-900 light:bg-white pl-4 pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                        <label className="w-full py-2" htmlFor={`song-${index}`}>{item[display]}</label>
                    </div>
                )
            })}
        </div>
    )
}
export default RList
