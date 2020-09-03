/**
 * JS 中没有 interface，TS 中有，先将就用着。
 */
export default class Packer {

    constructor(props) {
        this.callback = props.callback
        this.params = props.params
    }

    /**
     * 真正处理打包，注意检查参数
     */
    package() {}

    /**
     * 发送错误信息，收到后意味着打包错误
     * @param message 错误消息
     */
    onError(message) {
        this.callback(EVENT_ERROR, message)
    }

    /**
     * 发送日志信息，外界决定如何展示
     * @param message 日志消息
     */
    onLogDebug(message) {
        this.callback(EVENT_LOG_DEBUG, message)
    }

    /**
     * 发送日志信息，外界决定如何展示
     * @param message 日志消息
     */
    onLogError(message) {
        this.callback(EVENT_LOG_ERROR, message)
    }

    /**
     * 发送进度消息
     * @param message 当前进度
     */
    onProgress(message) {
        this.callback(EVENT_PROGRESS, message)
    }

    /**
     * 发送打包成功消息
     * @param message 日志文件路径
     */
    onPackSuccess(message) {
        this.callback(EVENT_PACK_SUCCESS, message)
    }

    /**
     * 发送打包失败消息
     * @param message 日志文件路径
     */
    onPackFailed(message) {
        this.callback(EVENT_PACK_FAILED, message)
    }

}

// 打包发生错误非执行脚本错误，{message: '母包路径没填写'}
export const EVENT_ERROR = 1
// 打包进度发生改变，{message: 10} Range(0 ~ 100)
export const EVENT_LOG_DEBUG = 2
// 打包日志，{message: '开始打包'} 不影响流程，但是出错
export const EVENT_LOG_ERROR = 3
// 打包日志，{message: '开始打包'} 不影响流程
export const EVENT_PROGRESS = 4
// 打包成功，{message: '/users/hefuwei/1.log'} message 为日志文件路径
export const EVENT_PACK_SUCCESS = 5
// 打包失败，{message: '/users/hefuwei/1.log'} message 为日志文件路径
export const EVENT_PACK_FAILED = 6