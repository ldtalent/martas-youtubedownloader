
export default interface ProcessExt extends NodeJS.Process {
    stdout: StdOutExec
}

interface StdOutExec extends NodeJS.WriteStream {
    cursorTo?: (l: number) => void
    clearLine?: (l: number) => void
}
