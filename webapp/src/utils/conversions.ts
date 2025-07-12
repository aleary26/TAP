export const nanosecondsToMilliseconds = (nanoseconds: number): number => {
    return nanoseconds / 1_000_000;
}

export const nanosecondsToSeconds = (nanoseconds: number): number => {
    return nanoseconds / 1_000_000_000;
}

export const millisecondsToSeconds = (milliseconds: number): number => {
    return milliseconds / 1_000;
}

