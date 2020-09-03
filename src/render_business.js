import AndroidPacker from "./pack/android_packer";
import IosPacker from "./pack/ios_packer";
import {getChannelList, getGameList} from "./data/repository";
import {
    EVENT_ERROR,
    EVENT_LOG_DEBUG,
    EVENT_LOG_ERROR,
    EVENT_PACK_FAILED,
    EVENT_PACK_SUCCESS,
    EVENT_PROGRESS
} from "./pack/packer";
import {clearLog, logD, logE} from "./utils/log_utils";

const electron = window.electron;
const ipcRenderer = window.ipcRenderer;
const dialog = window.remote.dialog

/**
 * 获取母包径
 */
function getBaseApkPath() {
    return document.getElementById("tv_base_apk_path").innerText
}

/**
 * 获取输出目录
 */
function getOutputDir() {
    return document.getElementById("tv_output_dir").innerText
}

/**
 * 获取输出文件名
 */
function getOutputName() {
    return document.getElementById('tv_output_name').value
}

/**
 * 获取额外资源目录
 */
function getExtraDir() {
    return document.getElementById("tv_extra_dir").innerText
}

/**
 * 获取签名文件路径
 */
function getKeystorePath() {
    return document.getElementById("tv_sign_path").innerText
}

/**
 * 获取签名文件密码
 */
function getKeystorePass() {
    return document.getElementById("tv_sign_pass").value
}

/**
 * 获取签名文件别名
 */
function getKeystoreAlias() {
    return document.getElementById("tv_sign_alias").value
}

/**
 * 获取签名文件别名密码
 */
function getKeystoreAliasPass() {
    return document.getElementById("tv_sign_alias_pass").value
}

/**
 * 打包操作
 */
window.build = function() {
    getGameList((games) => {
        getChannelList((channels) => {
            packAndroid(games[0], channels[0])
        })
    })
}

/**
 * Android 端打包
 */
function packAndroid(game, channel) {
    clearLog()
    const baseApkDir = getBaseApkPath()
    const extraDir = getExtraDir()
    const outputDir = getOutputDir()
    const outputName = getOutputName()
    const keystorePath = getKeystorePath()
    const keystorePass = getKeystorePass()
    const keystoreAlias = getKeystoreAlias()
    const keystoreAliasPass = getKeystoreAliasPass()
    const packer = new AndroidPacker({
        params: {
            game,
            channel,
            baseApkDir,
            extraDir,
            outputDir,
            outputName,
            keystorePath,
            keystorePass,
            keystoreAlias,
            keystoreAliasPass
        },
        callback: (type, message) => {
            switch (type) {
                case EVENT_LOG_DEBUG: {
                    logD(message)
                    break
                }
                case EVENT_LOG_ERROR: {
                    logE(message)
                    break
                }
                case EVENT_ERROR: {
                    logE(`打包失败，${message}`)
                    break
                }
                case EVENT_PROGRESS: {
                    logD(`当前进度${message}`)
                    break
                }
                case EVENT_PACK_FAILED: {
                    logE(`打包失败，日志文件：${message}`)
                    break
                }
                case EVENT_PACK_SUCCESS: {
                    logE(`打包成功，日志文件：${message}`)
                    break
                }
            }
        }
    })
    packer.package()
}

/**
 * Ios 打包，暂未实现
 */
function packIos(game, channel) {
    const packer = new IosPacker({
        params: {
            game,
            channel
        },
        callback: (type, message) => {

        }
    })
    packer.package()
}

window.openOutputDir = function () {
    electron.shell.showItemInFolder(`${getOutputDir()}/${getOutputName()}.apk`)
}

window.onChooseBaseApk = function () {
    const paths = dialog.showOpenDialogSync({filters: [{name: 'Apk', extensions: ['apk']}], properties: ['openFile']})
    const textView = document.getElementById('tv_base_apk_path')
    if (paths && paths.length > 0) {
        textView.innerText = paths[0]
    }
}

window.onChooseOutputPath = function () {
    const paths = dialog.showOpenDialogSync({properties: ['openDirectory']})
    const textView = document.getElementById('tv_output_dir')
    if (paths && paths.length > 0) {
        textView.innerText = paths[0]
    }
}

window.onChooseExtraPath = function () {
    const paths = dialog.showOpenDialogSync({properties: ['openDirectory']})
    const textView = document.getElementById('tv_extra_dir')
    if (paths && paths.length > 0) {
        textView.innerText = paths[0]
    }
}