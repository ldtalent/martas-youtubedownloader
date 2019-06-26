import fs from "fs"
import shell from "shelljs"
import os from "os"
import extract from "extract-zip"
export default class Utils {
    private _interval!: NodeJS.Timeout
    ffPath!: string
    /**
     * @param  {string} dir directory path
     */
    async checkDir(dir: string) {
        return new Promise((resolve) => {
            if (!fs.existsSync(dir)) {
                shell.mkdir("-p", dir)
                resolve()
            }
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
    /**
     * @param  {string} path target file path
     * @param  {string} dir destination directory
     * @returns Promise
     */
    async extract(path: string, dir: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loader(true)
            extract(path, { dir: dir, defaultFileMode: 777 }, (err: Error | undefined) => {
                if (err) {
                    reject(err)
                    this.loader(false)
                    return
                }
                fs.unlink(path, (err: NodeJS.ErrnoException | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                    this.loader(false)
                })
            })
        })
    }

    /**
     * @returns string | null
     */
    getPlatform(): string | null {
        switch (os.platform()) {
            case ("win32"): {
                return "windows-64"
            }
            case ("linux"): {
                if (os.arch() === "x64")
                    return "linux-64"
                else if (os.arch() === "x32")
                    return "linux-32"
            }
            case ("darwin"): {
                return "osx-64"
            }
            default: return null
        }
    }
    /**
    * @param  {string} data string in format hh:mm:ss
    * @returns {number} duration in miliseconds
    */
    getDuration(data: string): number {
        let dataArr = data.split(":")
        let duration = 0
        if (dataArr.length !== 3)
            return NaN
        dataArr.forEach((d: string, i: number) => {
            switch (i) {
                case (0): duration += parseInt(d) * 3600 * 1000
                    break;
                case (1): duration += parseInt(d) * 60 * 1000
                    break;
                case (2): duration += parseInt(d) * 1000
            }
        })
        return duration
    }
}
