import fs from "fs"
import shell from "shelljs"

export default class Utils {
    private _interval!: NodeJS.Timeout
    ffPath!: string
    /**
     * @param  {string} dir directory path
     */
    async checkDir(dir: string) {
        return new Promise((resolve) => {
            if (!fs.existsSync(dir))
                return shell.mkdir("-p", dir)
            else
                resolve()
        })
    }
    /**
     * @param  {boolean} run - start of stop loader
     */
    loader(run: boolean) {
        if (this._interval && !run) {
            clearInterval(this._interval)
        }
        else {
            this._interval = setInterval(() => {
                process.stdout.write(" .")
            }, 200)
        }
    }
}
