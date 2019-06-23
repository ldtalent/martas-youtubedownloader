const LATEST = `http://ffbinaries.com/api/v1/version/latest`

import request, { Response } from "request"
import progress from "request-progress"
import fs from "fs"
import path from "path"
import Utils from "../Utils";
import extract from "extract-zip"
export default class FfmpegDownloader {

    version!: string
    url!: string
    platform!: string
    utils!: Utils
    ffPath!: string
    constructor(utils: Utils) {
        this.utils = utils
    }

    async init() {
        const update = await this.checkUpdate()
        if (!update) {
            console.log(`Ffmpeg already on the latest version: `)
            return
        }
        await this.downloadVersion()
    }

    async checkUpdate(version?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            request.get(LATEST, { json: true }, (err: any, _: Response, body: any) => {
                if (err) {
                    reject(err)
                    return
                }
                if (body.version === version) {
                    resolve(false)
                }
                this.version = body.version
                const platform = this.utils.getPlatform()
                if (!platform) {
                    throw new Error("Unable to download ffmpeg")
                }
                this.url = body.bin[platform].ffmpeg
                this.platform = platform
                resolve(true)
            })
        })
    }

    async downloadVersion() {
        const ffDir = path.join(__dirname, `../../ffmpeg/${this.platform}/${this.version}`)
        await this.utils.checkDir(ffDir)
        this.ffPath = path.join(ffDir, "ffmpeg")
        const zipPath = this.ffPath + ".zip"
        if (this.utils.getPlatform() === "windows-64") {
            this.ffPath += ".exe"
            this.ffPath = this.ffPath.replace(/\\/g, "/")
        }
        fs.writeFileSync(path.join(__dirname, "./ffpath.json"), Buffer.from(`{ "ffPath": "${this.ffPath}","ffVersion":"${this.version}"}`))

        return new Promise((resolve, reject) => {
            process.stdout.write(`Downloading ffmpeg v${this.version}`)
            this.utils.loader(true)
            progress(request.get(this.url, { json: true }))
                .on("end", async () => {
                    this.utils.loader(false)
                    await this.extract(zipPath, ffDir)
                    resolve()
                })
                .on("error", () => {
                    reject("An error occured")
                    return
                })
                .pipe(fs.createWriteStream(zipPath))
        })
    }

    async extract(path: string, dir: string) {
        return new Promise((resolve, reject) => {
            process.stdout.write(`\nExtracting ffmpeg v${this.version}`)
            this.utils.loader(true)
            extract(path, { dir: dir, defaultFileMode: 777 }, (err: Error | undefined) => {
                if (err) {
                    reject(err)
                    return
                }
                fs.unlink(path, (err: NodeJS.ErrnoException | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                    this.utils.loader(false)
                })
            })
        })
    }
}
