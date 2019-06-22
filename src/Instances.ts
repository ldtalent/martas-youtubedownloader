import Args from "./Args";

export default class Instances {
    private _args: Args

    constructor() {
        this._args = new Args()
    }

    get args(): Args {
        return this._args
    }
}
