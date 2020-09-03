
import {app, ipcMain} from 'electron'
import {DOWNLOAD_COMPLETE, DOWNLOAD_FILES, DOWNLOAD_UPDATED} from "./proto/protocol";
import fs from "fs";
import AdmZip from "adm-zip";

export function initDownloader(webContents) {
    ipcMain.on(DOWNLOAD_FILES, (event, info) => {
        info.forEach((url) => {
            webContents.downloadURL(url)
            console.log('download: ' + url)
        })
    })
    webContents.session.on('will-download', (event, item) => {
        const url = item.getURL()
        const params = new URL(url).searchParams
        let directory = params.get('directory')
        let filename = params.get('filename')
        if (directory != null) {
            let path = ""
            if (filename == null || filename.length === 0) {
                path = directory
            } else {
                path = `${directory}/${filename}`
            }
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
            item.setSavePath(path)
        } else {
            item.setSavePath(`${app.getAppPath()}/download/${item.getFilename()}`)
        }
        item.on('updated', (event, state) => {
            webContents.send(DOWNLOAD_UPDATED, {
                url: url, progress: item.getReceivedBytes(), max: item.getTotalBytes(),
                filename: filename ? filename : item.getFilename()
            })
        })
        item.on('done', (event, state) => {
            if (state === "interrupted") {
                webContents.send(DOWNLOAD_COMPLETE, {url: url, filename: filename, success: false})
            } else {
                if (item.getFilename().endsWith(".zip")) {
                    let zip = new AdmZip(item.savePath)
                    zip.extractAllTo(directory, true)
                }
                webContents.send(DOWNLOAD_COMPLETE, {url: url, filename: filename ? filename : item.getFilename(), success: true})
            }
        })
    })
}