const LATEST = `http://ffbinaries.com/api/v1/version/latest`

import request, { Response } from "request"
import progress from "request-progress"
import fs from "fs"
import path from "path"
import Utils from "../Utils";
import ffInfo from "./ffInfo.json"

export default class FfmpegDownloader {

    utils: Utils
    version!: string
    url!: string
    platform!: string
    ffPath!: string

    constructor(utils: Utils) {
        this.utils = utils
    }
   
    async init() {
        const { update, version } = await this.checkUpdate()
        if (!update) {
            console.log(`Ffmpeg already on the latest version: ${version} `)
            return
        }
        await this.downloadVersion()
    }
    /**
     * @returns {object} update: should ffmpeg be updated; version: current ffmpeg version
     * 
     * - Check if ffmpeg should be updated
     */
    async checkUpdate(): Promise<{ update: boolean, version: string }> {
        const ffVersion = ffInfo.ffVersion
        return new Promise((resolve, reject) => {
            request.get(LATEST, { json: true }, (err: any, _: Response, body: any) => {
                if (err) {
                    reject(err)
                    return
                }
                if (body.version === ffVersion) {
                    resolve({ update: false, version: ffVersion })
                    return
                }
                this.version = body.version
                const platform = this.utils.getPlatform()
                if (!platform) {
                    throw new Error("Unable to download ffmpeg")
                }
                this.url = body.bin[platform].ffmpeg
                this.platform = platform
                resolve({ update: true, version: this.version })
            })
        })
    }
  
    /**
     * @returns Promise<void>
     * 
     * - Downloads ffmpeg.
     */
    async downloadVersion():Promise<void> {
        const ffDir = path.join(__dirname, `../../ffmpeg/${this.platform}/${this.version}`)
        await this.utils.checkDir(ffDir)
        this.ffPath = path.join(ffDir, "ffmpeg")
        const zipPath = this.ffPath + ".zip"
        // If platform is windows, add .exe extension and replace path slashes.
        if (this.utils.getPlatform() === "windows-64") {
            this.ffPath += ".exe"
            this.ffPath = this.ffPath.replace(/\\/g, "/")
        }
        fs.writeFileSync(path.join(__dirname, "./ffInfo.json"), Buffer.from(`{ "ffPath": "${this.ffPath}","ffVersion":"${this.version}"}`))
        // Download ffmpeg
        return new Promise((resolve, reject) => {
            process.stdout.write(`Downloading ffmpeg v${this.version}`)
            this.utils.loader(true)
            progress(request.get(this.url, { json: true }))
                .on("end", async () => {
                    this.utils.loader(false)
                    process.stdout.write(`\nExtracting ffmpeg v${this.version}`)
                    await this.utils.extract(zipPath, ffDir)
                    resolve()
                })
                .on("error", () => {
                    reject("An error occured")
                    return
                })
                .pipe(fs.createWriteStream(zipPath))
        })
    }
}
