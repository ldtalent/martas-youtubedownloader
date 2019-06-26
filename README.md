# martas-project - yt-converter

This is a simple tool that enables the download and conversion of Youtube videos to other formats.

## Installation

- clone this repository

- run: `npm i <repository root>` for local or `npm i -g <repository root>` for global installation. 

## Usage

### Local
``` js
const YtConverter = require("yt-converter").default

new YtConverter().init(["https://www.youtube.com/watch\?v\=07d2dXHYb94"], "./movies", true, "avi").catch(err => { console.error(err) })

```

### Global

`ytc --url <video-url>`


#### Options

- `--url, -u <urls>` - array of video urls
- `--convert, -c` - convert to .mp3
- `--format, -f <format>` - convert to any other format
- `--dir, -d <directory>` - set a custom target directory
- `--update-ffmpeg, --uf` - update ffmpeg binary
- `--help, -h ` - show help
