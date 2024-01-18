function padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
}

export function dateInHhMmDdMmYyyy(dateEpoch: number, dateDivider: string = "-") {
    const date = new Date(dateEpoch);
    return (
        [
            padTwoDigits(date.getHours()),
            padTwoDigits(date.getMinutes()),
        ].join(":") + " " +
        [
            padTwoDigits(date.getDate()),
            padTwoDigits(date.getMonth() + 1),
            date.getFullYear()
        ].join(dateDivider)
    );
}