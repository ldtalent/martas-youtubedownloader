import Args from "./Args";
import Instances from "./instances";

export default class YtConverter {

    _args: Args

    constructor() {
        const { args } = new Instances()
        this._args = args
    }
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
        this._args.setArgs(urls, dir, convert, format, update)

        if (!Array.isArray(this._args.urls)) {
            throw new Error("The first argument must be an array!")
        }
        process.stdout.write(`\nDownloading ${this._args.urls.length} videos to directory ${this._args.dir}`)
    }
}
