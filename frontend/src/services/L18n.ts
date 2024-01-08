export function printTermWord(count: number){
    if (count % 10 === 1)
        return `${count} term`;

    return `${count} terms`;
}