export function findStringsInCurlyBraces(input: string) {
    const regex = /\{([^}]+)\}/g;
    const matches = input.match(regex);

    if (!matches) {
        return [];
    }

    return matches.map(match => match.slice(1, -1));
}

export function substituteBraces(input: string) {
    return input.replace(/\{/g, "<%= ").replace(/\}/g, " %>");
}