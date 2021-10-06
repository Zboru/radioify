import React from "react";

const Stepper = (props: {children: React.ReactNode}) => {
    return (
        <div className="grid grid-cols-4 gap-4 w-100m-auto">
            {props.children}
        </div>
    )
}
export default Stepper
