import { nanosecondsToSeconds } from "@/utils/conversions";

export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export const formatPercentage = (ratio: number): string => {
    return (ratio * 100).toFixed(1) + '%';
}

export const formatDuration = (nanoseconds: number): string => {
    const seconds = nanosecondsToSeconds(nanoseconds);
    
    if (seconds < 0.001) {
        return (nanoseconds / 1_000).toFixed(0) + 'μs';
    } else if (seconds < 1) {
        return (nanoseconds / 1_000_000).toFixed(0) + 'ms';
    } else if (seconds < 60) {
        return seconds.toFixed(2) + 's';
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
    }
}

export const formatTokensPerSecond = (tokensPerSecond: number): string => {
    if (tokensPerSecond >= 1000) {
        return (tokensPerSecond / 1000).toFixed(1) + 'K t/s';
    }
    return tokensPerSecond.toFixed(1) + ' t/s';
}

export const formatTimestamp = (timestamp?: string): string => {
     return (timestamp) ? new Date(timestamp).toLocaleString() : 'N/A';
};