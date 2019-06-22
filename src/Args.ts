import yargs from "yargs"

export default class Args {
    private _urls!: Array<string | number>
    private _dir!: string
    private _convert!: boolean
    private _format!: string
    private _update!: boolean

    constructor() {
        this.parseCliArgs()
    }
    parseCliArgs() {
        const args = yargs
            .option('url', {
                alias: "u",
                describe: "video url to download",
                array: true,
            })
            .option('dir', {
                alias: "d",
                default: `/home/${require("os").userInfo().username}/videos`,
                describe: "destination directory",
                string: true
            })
            .option('convert', {
                alias: "c",
                default: false,
                describe: "convert to mp3",
                boolean: true
            })
            .option('format', {
                alias: "f",
                default: "mp3",
                describe: "format to convert into",
                string: true
            })
            .option('update-ffmpeg', {
                alias: "uf",
                default: false,
                describe: "update ffmpeg",
                boolean: true
            })
            .help('help')
            .argv
        if (args.url)
            this._urls = args.url
        this._dir = args.dir
        this._convert = args.convert
        this._format = args.format
        this._update = args["update-ffmpeg"]
    }

    setArgs(urls?: Array<string>, dir?: string, convert?: boolean, format?: string, update?: boolean) {
        if (urls)
            this._urls = urls
        if (dir)
            this._dir = dir
        if (convert)
            this._convert = convert
        if (format)
            this._format = format
        if (update)
            this._update = update
        if (!this._urls || this._urls.length === 0)
            throw new Error("Url argument is required!")
    }

    get urls() {
        return this._urls
    }

    get dir() {
        return this._dir
    }

    get convert() {
        return this._convert
    }

    get format() {
        return this._format
    }

    get update() {
        return this._update
    }
}
