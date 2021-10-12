import {useEffect, useRef, useState} from "react";

function useDragging() {
    const [isDragging, setIsDragging] = useState(false);
    const [pos, setPos] = useState({x: 0});
    const sliderRef = useRef<HTMLDivElement>(null);
    const dot1Ref = useRef<HTMLDivElement>(null);
    const dot2Ref = useRef<HTMLDivElement>(null);

    function onMouseMove(e: { x: number; y: number; stopPropagation: () => void; preventDefault: () => void; }) {
        if (!isDragging) return;
        if (dot1Ref.current) {
            const sliderPositionX = sliderRef.current?.getBoundingClientRect().x
            if (sliderPositionX) {
                let newPosition = (e.x - sliderPositionX) - dot1Ref.current.offsetWidth / 2
                if (e.x > sliderPositionX + sliderRef.current.offsetWidth) {
                    newPosition = sliderRef.current.offsetWidth - dot1Ref.current.offsetWidth / 2
                }
                if (e.x < sliderPositionX) {
                    newPosition = 0 - dot1Ref.current.offsetWidth / 2
                }
                setPos({
                    x: newPosition
                });
            }
        }
        e.stopPropagation();
        e.preventDefault();
    }

    function onMouseUp(e: { stopPropagation: () => void; preventDefault: () => void; }) {
        setIsDragging(false);
        e.stopPropagation();
        e.preventDefault();
    }

    function onMouseDown(e: { button: number; x: number; y: number; stopPropagation: () => void; preventDefault: () => void; }) {
        if (e.button !== 0) return;
        setIsDragging(true);
        if (dot1Ref.current) {
            const sliderPositionX = sliderRef.current?.getBoundingClientRect().x
            if (sliderPositionX) {
                setPos({
                    x: (e.x - sliderPositionX) - dot1Ref.current.offsetWidth / 2
                });
            }
        }

        e.stopPropagation();
        e.preventDefault();
    }

    // When the element mounts, attach an mousedown listener
    useEffect(() => {
        dot1Ref.current?.addEventListener("mousedown", onMouseDown);

        return () => {
            dot1Ref.current?.removeEventListener("mousedown", onMouseDown);
        };
    }, [dot1Ref.current]);

    // Everytime the isDragging state changes, assign or remove
    // the corresponding mousemove and mouseup handlers
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mouseup", onMouseUp);
            document.addEventListener("mousemove", onMouseMove);
        } else {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);
        }
        return () => {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [isDragging]);

    return [sliderRef, dot1Ref, dot2Ref, pos.x];
}

export default useDragging
