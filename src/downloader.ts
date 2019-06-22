import youtubedl from "youtube-dl";
import fs from "fs"
import path from "path"
import Utils from "./utils";
import humanize from "humanize"
import ProcessExec from "../types/process";

export default class Downloader {
    private _utils: Utils
    constructor(utils: Utils) {
        this._utils = utils
    }
    /**
     * @param  {string} url - video url
     *  - Get video information from youtube
     */
    async getVideoInfo(url: string): Promise<youtubedl.Info> {
        // check if url is a video url
        if (!url.match("/watch?"))
            throw new Error("Invalid video url")
        return new Promise((res, rej) => {
            return youtubedl.getInfo(url, (err:Error, info:any) => {
                if (err)
                    rej(err)
                else {
                    res(info)
                }
            })
        })
    }

    /**
     * @param  {string} url - video url
     * @param  {string} dir - destination directory
     */
    async downloadVideos(url: string, dir: string) {
        this._utils.loader(true)

        return new Promise(async (resolve, reject) => {
            let processExec: ProcessExec = process
            let video: youtubedl.Youtubedl
            let videoInfo
            try {
                videoInfo = await this.getVideoInfo(url)
            }
            catch (err) {
                reject(err)
                return
            }
            let filename = videoInfo._filename
            let position = 0;
            let videoSize: number
            if (!videoInfo) {
                throw new Error(`Unable to get video info from url ${url}`)
            }
            await this._utils.checkDir(dir)
            video = youtubedl(url,
                ['--format=18'],
                { cwd: dir });

            video.on('info', (info: youtubedl.Info) => {
                this._utils.loader(false)
                videoSize = info.size
                console.log(`\nDownloading ${info._filename}`)
                console.log(`Size: ${humanize.filesize(info.size)}`);
            });

            video.on('data', (chunk: any) => {
                position += chunk.length;
                if (videoSize) {
                    var percent = (position / videoSize * 100).toFixed(2);
                    if (processExec.stdout.cursorTo && processExec.stdout.clearLine) {
                        processExec.stdout.cursorTo(0);
                        processExec.stdout.clearLine(1);
                        process.stdout.write(percent + '%');
                    }
                }
            });
            video.on('end', async () => {
                process.stdout.write(' - DONE\n');
                resolve()
            })

            video.pipe(fs.createWriteStream(`${path.join(dir, filename)}`));
        })
    }
}
