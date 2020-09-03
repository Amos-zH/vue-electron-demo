/**
 * 打印错误日志
 */
export function logE(message) {
    checkContainer((container) => {
        const br = document.createElement('br')
        const text = document.createElement("text")
        text.style.color = 'red'
        text.innerHTML = message
        container.appendChild(br)
        container.appendChild(text)
    })
}

/**
 * 打印调试日志
 */
export function logD(message) {
    checkContainer((container) => {
        const br = document.createElement('br')
        const text = document.createElement("text")
        text.innerHTML = message
        container.appendChild(br)
        container.appendChild(text)
    })
}

/**
 * 清除日志
 */
export function clearLog() {
    checkContainer((container) => {
        container.innerHTML = ""
    })
}

function checkContainer(callback) {
    const container = findContainer()
    if (container != null) {
        callback(container)
    }
}

function findContainer() {
    return document.getElementById("logContainer")
}