import YtConverter from "./YtConverter"

export function init(urls?: Array<string>, dir?: string, convert?: boolean, format?: string) {
    new YtConverter().init(urls, dir, convert, format).catch((err: Error) => {
        console.error("ERROR", err)
        process.exit(1)
    })
}
