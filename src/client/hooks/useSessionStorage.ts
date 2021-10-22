import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any) {
    const saved = sessionStorage.getItem(key);
    if (saved != null) {
        return JSON.parse(saved);
    }
    return defaultValue;
}

export const useSessionStorage = (key: string, defaultValue: any) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
