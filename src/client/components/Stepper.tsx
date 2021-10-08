import React from "react";
import clsx from "clsx";

const Stepper = (props: { children: React.ReactNode, className: string }) => {
    return (
        <div className={clsx(props.className, `grid grid-cols-3 sm:grid-cols-5 gap-4`)}>
            {props.children}
        </div>
    )
}
export default Stepper
