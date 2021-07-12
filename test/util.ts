export function sleep(i: number) {
    return new Promise(x => setTimeout(x, i));
}