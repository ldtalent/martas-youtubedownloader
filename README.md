# martas-project - yt-converter

This is a simple tool that enables the download and conversion of Youtube videos to other formats.

## Installation

- clone this repository

- run: `npm i [repository root]` for local or `npm i -g [repository root]` for global installation. 

## Usage

### Local
``` js
const YtConverter = require("yt-converter").default

new YtConverter().init(["https://www.youtube.com/watch\?v\=07d2dXHYb94"], "./movies", true, "avi").catch(err => { console.error(err) })

```

### Global

`ytc -url [video-url]`


#### Options

- `-c` - convert to .mp3
- `-f [format]` - convert to any other format
- `-d [directory]` - set a custom target directory
- `--uf` - update ffmpeg binary
- `-h ` - show help
