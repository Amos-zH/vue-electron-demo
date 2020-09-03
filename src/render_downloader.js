import {DOWNLOAD_COMPLETE, DOWNLOAD_FILES, DOWNLOAD_UPDATED} from "./proto/protocol";

/**
 * 开始下载
 * @param urls 需要下载的 url 队列
 * @param callback 下载结果回调 true 下载成功 false 下载失败
 */
export function startDownload(urls, callback) {
    ipcRenderer.removeAllListeners(DOWNLOAD_COMPLETE)
    ipcRenderer.on(DOWNLOAD_COMPLETE, (event, args) => {
        if (!args.success) {
            callback(false, args.url)
            ipcRenderer.removeAllListeners(DOWNLOAD_COMPLETE)
        } else {
            urls.remove(args.url)
            if (urls.length === 0) {
                callback(true, args.url)
                ipcRenderer.removeAllListeners(DOWNLOAD_COMPLETE)
            }
        }
    })
    ipcRenderer.send(DOWNLOAD_FILES, urls)
}