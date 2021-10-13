import React, {ChangeEvent, useState} from "react"
import TextField from "./TextField";
import Fuse from "fuse.js";
import clsx from "clsx";

interface AutocompleteItems {
    text: string,
    value: string | number
}

interface Props {
    label: string,
    placeholder: string,
    items?: any[] | null,
    searchBy?: string,
    display?: string,
    value?: [string | object]
    onSelect: (item: any) => void,
}

const RAutocomplete = ({label, placeholder, items, display, searchBy, onSelect}: Props) => {
    let [search, setSearch] = useState("");
    let [listPosition, setPosition] = useState(0);
    let [listState, toggleList] = useState(false);
    
    function handleTextFieldEvent(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.currentTarget.value)
        setPosition(0);
    }

    function handleTextFieldFocus() {
        toggleList(true)
    }

    function handleTextFieldBlur() {
        toggleList(false)
    }

    function scrollToItem() {
        const item = document.querySelector('.active-list-item');
        if (item) {
            item.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    function selectItem(item: any) {
        setSearch(item[display || 'text']);
        toggleList(false);
        setPosition(0);
        onSelect(item);
    }

    function handleKeyboard(event: React.KeyboardEvent) {
        const KEY_DOWN = "ArrowDown";
        const KEY_UP = "ArrowUp";
        const BACKSPACE = "Backspace";
        const ENTER = "Enter";

        toggleList(true)

        if (event.key === KEY_DOWN || event.key === KEY_UP || event.key === ENTER) {
            event.preventDefault();
            event.stopPropagation();
        }
        const items = filteredItems();
        if (typeof filteredItems() !== 'undefined') {
            if (event.key === KEY_DOWN) {
                toggleList(true)
                if (items && listPosition < items.length - 1) {
                    setPosition(listPosition += 1)
                }
            }
            if (event.key === KEY_UP) {
                toggleList(true)
                if (items && listPosition > 0) {
                    setPosition(listPosition -= 1)
                }
            }
            if (event.key === ENTER) {
                if (items) {
                    const item = items[listPosition];
                    selectItem(item);
                }
            }
            if (event.key === BACKSPACE) {
                toggleList(true)
            }
        }
        scrollToItem();
    }

    function filteredItems() {
        if (items) {
            const options = {
                includeScore: true,
                keys: [searchBy || 'text'],
            }
            const fuse = new Fuse(items, options)
            if (search) {
                return fuse.search(search).map(result => result.item)
            } else {
                return items
            }
        }
    }

    return (
        <div className="relative">
            <TextField className="mt-2" value={search} onKeyDown={handleKeyboard} onBlur={handleTextFieldBlur} onFocus={handleTextFieldFocus}
                       onChange={handleTextFieldEvent}
                       label={label} placeholder={placeholder}/>
            {(listState && items) &&
            <div className="absolute max-h-64 no-scrollbar overflow-y-scroll w-full shadow rounded w-full">
                {filteredItems()?.map((item, index) => {
                    return <div onMouseEnter={()=>{setPosition(index)}} onMouseDown={(ev)=>{ev.preventDefault();selectItem(item)}} className={clsx("border select-none dark:border-gray-700 p-2 dark:bg-gray-900 dark:text-white bg-white p-2",{'bg-gray-300 dark:bg-gray-700 active-list-item': listPosition === index})} key={index}>{item[display || 'text']}</div>
                })}
            </div>
            }
        </div>
    )
}
export default RAutocomplete
