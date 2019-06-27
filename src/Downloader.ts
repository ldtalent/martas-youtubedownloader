import youtubedl from "youtube-dl";
import fs from "fs"
import path from "path"
import Utils from "./Utils";
import humanize from "humanize"
import ProcessExt from "../types/processExt";

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
            return youtubedl.getInfo(url, (err: Error, info: any) => {
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
     * @returns {object} video filename and directory.
     */
    async downloadVideos(url: string, dir: string): Promise<{ filename: string, dir: string }> {
        this._utils.loader(true)

        return new Promise(async (resolve, reject) => {
            let processExt: ProcessExt = process
            let video: youtubedl.Youtubedl
            let videoInfo: youtubedl.Info
            let position = 0;
            let videoSize = 0;
            let filename:string

            try {
                videoInfo = await this.getVideoInfo(url)
            }
            catch (err) {
                reject(err)
                return
            }
            if (!videoInfo) {
                throw new Error(`Unable to get video info from url ${url}`)
            }
            filename = videoInfo._filename

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
                    // calculate video download percentage
                    var percent = (position / videoSize * 100).toFixed(2);
                    if (processExt.stdout.cursorTo && processExt.stdout.clearLine) {
                        processExt.stdout.cursorTo(0);
                        processExt.stdout.clearLine(1);
                        process.stdout.write(percent + '%');
                    }
                }
            });
            video.on('end', async () => {
                process.stdout.write(' - DONE\n');
                resolve({ filename, dir })
                this._utils.loader(false)
            })

            video.pipe(fs.createWriteStream(`${path.join(dir, filename)}`));
        })
    }
}
