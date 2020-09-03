import {getVersionName} from "../utils/xml_parser";
import {startDownload} from "../render_downloader";
import Packer from "./packer";

const electron = window.electron;
const ipcRenderer = window.ipcRenderer;
const dialog = window.remote.dialog
const fileSystem = window.fileSys
const process = window.process

export default class AndroidPacker extends Packer {

    package() {
        const {
            game,
            channel,
            baseApkDir,
            outputDir,
            outputName,
            extraDir,
            keystorePath,
            keystorePass,
            keystoreAlias,
            keystoreAliasPass,
        } = this.params
        if (!baseApkDir) {
            this.onError("请选择母包路径")
        } else if (!outputDir) {
            this.onError("请选择输出目录")
        } else if (!outputName) {
            this.onError('请输入输出文件名')
        } else if (!keystorePath) {
            this.onError('请选择签名文件')
        } else if (!keystorePass) {
            this.onError('请输入签名文件密码')
        } else if (!keystoreAlias) {
            this.onError('请输入签名文件别名')
        } else if (!keystoreAliasPass) {
            this.onError('请输入签名文件别名密码')
        } else {
            this.onLogDebug('打包开始！')
            this.onLogDebug('母包路径:' + baseApkDir)
            this.onLogDebug('输出目录:' + outputDir)
            this.onLogDebug('输出文件名:' + outputName)
            this.onLogDebug('额外资源目录:' + extraDir)
            this.onLogDebug('签名文件路径:' + keystorePath)
            this.onLogDebug('签名文件密码:' + keystorePass)
            this.onLogDebug('签名文件别名:' + keystoreAlias)
            this.onLogDebug('签名文件别名密码:' + keystoreAliasPass)
            const iconDir = fullPath(`icon/${channel.id}`)
            const splashDir = fullPath(`splash/${channel.id}`)
            const configDir = fullPath(`config/${channel.id}`)
            const sdkDir = fullPath('sdk')
            const pluginDir = fullPath('plugin')
            let downloadQueue = []
            // step 1: check channel sdk.
            if (fileSystem.existsSync(`${sdkDir}/${channel.sdk}`)) {
                const version = getVersionName(`${sdkDir}/${channel.sdk}/config.xml`)
                this.onLogDebug(`渠道 SDK ${channel.sdk} 已经存在，当前版本：` + version)
            } else {
                downloadQueue.push(createUrlWithParams(channel.channelSdkDownloadUrl, sdkDir, `${channel.sdk}.zip`))
            }
            const channelParamsKey = Object.keys(channel.channelParams)
            const pluginSdkParams = channel.pluginSdkParams
            // step 2: check plugin sdk
            pluginSdkParams.forEach((plugin) => {
                if (fileSystem.existsSync(`${pluginDir}/${plugin.sdkName}`)) {
                    const version = getVersionName(`${pluginDir}/${plugin.sdkName}/config.xml`)
                    this.onLogDebug(`插件 SDK ${plugin.sdkName} 已经存在，当前版本: ${version}`)
                } else {
                    const url = `${channel.pluginSdkDownloadBaseUrl}/${plugin.sdkName}.zip`
                    downloadQueue.push(createUrlWithParams(url, pluginDir, `${plugin.sdkName}.zip`))
                }
            })
            // step 3: check param file
            channelParamsKey.forEach((key) => {
                const param = channel.channelParams[key]
                if (param.downloadUrl && param.downloadUrl.length > 0) {
                    downloadQueue.push(createUrlWithParams(param.downloadUrl, `${configDir}/${param.value}`, ''))
                }
            })
            // step 4: download icon, if needed
            if (channel.channelIconDownloadUrl != null && channel.channelIconDownloadUrl.length > 0) {
                downloadQueue.push(createUrlWithParams(channel.channelIconDownloadUrl, iconDir, ICON_FILE_NAME))
            }
            // step 5: download splash, if needed
            if (channel.splashDownloadUrl != null && channel.splashDownloadUrl.length > 0) {
                downloadQueue.push(createUrlWithParams(channel.splashDownloadUrl, splashDir, SPLASH_FILE_NAME))
            }
            // step 6: start download
            startDownload(downloadQueue, (isSuccess, url) => {
                if (isSuccess) {
                    // step 7: combine params
                    const localResource = {
                        "apkSourcePath": baseApkDir,
                        "channelIconPath": `${iconDir}/${ICON_FILE_NAME}`,
                        "channelParamFilePath": `${configDir}`,
                        "splashPath": `${splashDir}/${SPLASH_FILE_NAME}`,
                        "extraResourcePath": extraDir,
                        "outputApkName": outputName,
                        "outputApkPath": outputDir
                    }
                    const globalResource = {
                        "channelSdkPath": `${sdkDir}/${channel.sdk}`,
                        "pluginSdkPath":pluginDir,
                        "keystore":{
                            "filePath":keystorePath,
                            "aliasName":keystoreAlias,
                            "aliasPwd":keystoreAliasPass,
                            "password":keystorePass
                        }
                    }
                    const params = {
                        game: game,
                        channel: channel,
                        channelParams: channel.channelParams,
                        pluginSdkParams: channel.pluginSdkParams,
                        localResources: localResource,
                        globalResources: globalResource
                    }
                    // step 8: real package
                    this.realPackage(params, game, channel)
                } else {
                    this.onError(`下载失败：${url}`)
                }
            })
        }
    }

    /**
     * 执行打包操作
     * @param params 脚本参数
     * @param game 游戏
     * @param channel 渠道
     */
    realPackage(params, game, channel) {
        this.onLogDebug('正在清除工作目录！')
        deleteDir(fullPath(`pack/workspace/game${game.id}/${channel.sdk}${channel.id}`))
        this.onLogDebug('清除工作目录成功！')
        this.onProgress(0)
        const timer = setInterval(() => {
            fileSystem.readFile(this.progressFile(game, channel), (err, data) => {
                if (data) {
                    this.onProgress(parseInt(data.toString()))
                }
            })
        }, 500)
        const logPath = fullPath(`log/${new Date().getTime()}.log`)
        const script = `python ${fullPath("pack/scripts/package.py")} ${this.convertObject(params)}`
        process.exec(script, {
            maxBuffer: 10 * 1024 * 1024
        }, (error, stdout, stderr) => {
            fileSystem.writeFile(logPath, stderr + stdout, {flag: 'a'}, (err) => {
                if (err) {
                    this.onLogError(err.message)
                }
            });
            fileSystem.readFile(this.progressFile(game, channel), (err, progress) => {
                if (!progress) {
                    progress = 0
                }
                if (err) {
                    this.onLogError(err.message)
                }
                if (parseInt(progress.toString()) === 100) {
                    this.onProgress(100)
                    this.onPackSuccess(logPath)
                } else {
                    this.onPackFailed(logPath)
                }
            })
            clearInterval(timer)
        })
    }

    /**
     * 获取进度文件路径
     * @param game 游戏
     * @param channel 渠道
     * @returns {string} 路径
     */
    progressFile(game, channel) {
        return fullPath(`pack/workspace/game${game.id}/${channel.sdk}${channel.id}/progress_temp/progress.txt`)
    }

    /**
     * 将对象转换为 Python 脚本参数
     * @param obj 对象
     * @returns {string} 参数字符串
     */
    convertObject(obj) {
        return "\"" + JSON.stringify(obj).replace(/"/g, "'") + "\"";
    }
}

/**
 * 递归删除文件夹
 * @param path 待删除目录
 */
function deleteDir(path) {
    let files = [];
    if (fileSystem.existsSync(path)) {
        files = fileSystem.readdirSync(path);
        files.forEach((file) => {
            let curPath = path + '/' + file
            if (fileSystem.statSync(curPath).isDirectory()) {
                deleteDir(curPath);
            } else {
                fileSystem.unlinkSync(curPath);
            }
        });
        fileSystem.rmdirSync(path);
    }
}

/**
 * 创建 indexOf 扩展方法，这个方法都木有。。
 */
Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};

/**
 * 创建 remove 扩展方法，这个方法都木有。。
 */
Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function fullPath(path) {
    return `${remote.app.getAppPath()}/workspace/${path}`;
}

function createUrlWithParams(url, directory, filename) {
    const query = `directory=${directory}&filename=${filename}`
    if (url.indexOf('?') !== -1) {
        url =`${url}&${query}`
    } else {
        url =`${url}?${query}`
    }
    return url
}

const ICON_FILE_NAME = "icon.png"
const SPLASH_FILE_NAME = "splash.png"