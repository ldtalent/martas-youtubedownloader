import fs from "fs"
import shell from "shelljs"
import os from "os"
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
}
