import Args from "./Args";
import Downloader from "./Downloader";
import Utils from "./Utils";
import FfmpegDownloader from "./ffmpeg-downloader";
import Converter from "./Converter";

export default class Instances {
    private _args: Args
    private _utils: Utils
    private _downloader!: Downloader
    private _ffmpegDownloader!: FfmpegDownloader
    private _converter!: Converter
    
    constructor() {
        this._args = new Args()
        this._utils = new Utils()
    }

    get args(): Args {
        return this._args
    }
    get utils(): Utils {
        return this._utils
    }

    get downloader(): Downloader {
        if (!this._downloader) {
            this._downloader = new Downloader(this.utils)
        }
        return this._downloader
    }
    get ffmpegDownloader(): FfmpegDownloader {
        if (!this._ffmpegDownloader) {
            this._ffmpegDownloader = new FfmpegDownloader(this.utils)
        }
        return this._ffmpegDownloader
    }
    get converter(): Converter {
        if (!this._converter) {
            this._converter = new Converter(this.utils)
        }
        return this._converter
    }
}