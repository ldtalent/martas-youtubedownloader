export default class YtConverter {

    /**
     * @param  {Array<string>} urls
     * - array of video urls to download
     * @param  {string} dir - optional
     * - destination directory - default /home/{user}/videos
     * @param  {boolean} convert - optional
     *  - should the videos be converted - default: false
     * @param  {string} format - optional
     *  - format to convert into - default: "mp3"
     */
    async init(urls?: Array<string>, dir?: string, convert?: boolean, format?: string, update?: boolean) {
    }
}

export function init(urls?: Array<string>, dir?: string, convert?: boolean, format?: string) {
    new YtConverter().init(urls, dir, convert, format).catch((err:Error) => {
        console.error("ERROR", err)
        process.exit(1)
    })
}
