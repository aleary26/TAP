export const textContainsJson = (text: string): boolean => {
    // Find all positions where JSON might start
    const matches = text.matchAll(/[\{\[]/g);

    if (!matches) return false;
    
    for (const match of matches) {
        const startPos = match.index!;
        
        // Try parsing from this position to various end positions
        for (let endPos = startPos + 1; endPos <= text.length; endPos++) {
            try {
                const candidate = text.substring(startPos, endPos);
                JSON.parse(candidate);
                return true; // Found valid JSON!
            } catch {
                continue;
            }
        }
    }
    
    return false;
}

