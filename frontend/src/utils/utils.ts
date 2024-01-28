export const indexifyFunction = <Type, >(idx: number, f: (idx: number, value: Type) => void) => {
    return (value: Type) => f(idx, value)
}