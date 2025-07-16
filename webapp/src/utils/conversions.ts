export const nanosecondsToMilliseconds = (nanoseconds: number): number => {
    return nanoseconds / 1_000_000;
}

export const nanosecondsToSeconds = (nanoseconds: number): number => {
    return nanoseconds / 1_000_000_000;
}

export const millisecondsToSeconds = (milliseconds: number): number => {
    return milliseconds / 1_000;
}

export const bytesToGigabytes = (bytes: number): number => {
    return bytes / 1_000_000_000;
}

export const bytesToMegabytes = (bytes: number): number => {
    return bytes / 1_000_000;
}
