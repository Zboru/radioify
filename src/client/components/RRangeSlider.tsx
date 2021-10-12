import React from "react"
import useDragging from "../hooks/useDragging";

const RRangeSlider = () => {
    const [sliderRef, dot1Ref, dot2Ref, x] = useDragging();
    return (
        <div className="flex w-64 m-auto items-center h-32 justify-center">
            <div className="py-1 relative min-w-full">
                <div ref={sliderRef} className="h-2 bg-gray-200 rounded-full">
                    <div ref={dot1Ref} style={{left: x + 'px'}}
                         className="w-4 h-4 absolute top-0 bg-gray-400 rounded-full"/>
                    <div className="bg-blue-500 h-2 rounded-full"/>
                    <div className="w-4 h-4 absolute top-0 left-10 bg-gray-400 rounded-full"/>
                    {/*<div className="absolute h-2 rounded-full bg-teal-600 w-0"/>*/}
                    {/*<div*/}
                    {/*    className="absolute h-4 flex items-center justify-center w-4 rounded-full bg-white shadow border border-gray-300 -ml-2 top-0 cursor-pointer"*/}
                    {/*    unselectable="on">*/}
                    {/*    <div className="relative -mt-2 w-1">*/}
                    {/*        <div className="absolute z-40 opacity-100 bottom-100 mb-2 left-0 min-w-full"*/}
                    {/*             >*/}
                    {/*            <div className="relative shadow-md">*/}
                    {/*                <div className="bg-black -mt-8 text-white truncate text-xs rounded py-1 px-4">$ 15*/}
                    {/*                </div>*/}

                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div*/}
                    {/*    className="absolute h-4 flex items-center justify-center w-4 rounded-full bg-white shadow border border-gray-300 -ml-2 top-0 cursor-pointer"*/}
                    {/*    unselectable="on">*/}
                    {/*    <div className="relative -mt-2 w-1">*/}
                    {/*        <div className="absolute z-40 opacity-100 bottom-100 mb-2 left-0 min-w-full"*/}
                    {/*            >*/}
                    {/*            <div className="relative shadow-md">*/}
                    {/*                <div className="bg-black -mt-8 text-white truncate text-xs rounded py-1 px-4">$ 30*/}
                    {/*                </div>*/}

                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="absolute dark:text-white text-gray-800 -ml-1 bottom-0 left-0 -mb-6">0</div>
                    <div className="absolute dark:text-white text-gray-800 -mr-1 bottom-0 right-0 -mb-6">24</div>
                </div>
            </div>
        </div>
    )
}
export default RRangeSlider
