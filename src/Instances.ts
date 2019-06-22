import Args from "./Args";
import Downloader from "./Downloader";
import Utils from "./Utils";

export default class Instances {
    private _args: Args
    private _utils: Utils
    private _downloader!: Downloader

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
}
