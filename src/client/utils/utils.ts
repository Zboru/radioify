export function range(start: number, end: number) {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}

export function chunk(arr: any[], size: number) {
    return Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
        arr.slice(i * size, i * size + size)
    )
}
