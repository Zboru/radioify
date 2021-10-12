import React from "react"
import clsx from "clsx";

interface IProps {
    active: boolean,
    children: React.ReactNode,
    className?: string
}

const Card = ({children, active, className}: IProps) => {
    return (
        <div
            className={clsx(
                className,
                'shadow p-4 bg-white dark:bg-gray-800 rounded',
                active ? 'visible' : 'hidden',
            )}
        >{children}</div>
    )
}
export default Card
