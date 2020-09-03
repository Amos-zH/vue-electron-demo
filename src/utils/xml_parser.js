/**
 * 读取指定 xml 内部的版本号
 */
export function getVersionName(path) {
    const text = window.fileSys.readFileSync(path)
    const parser = new DOMParser()
    const doc = parser.parseFromString(text.toString(), "text/xml")
    const versions = doc.getElementsByTagName('versionName')
    if (versions && versions.length > 0) {
        return versions[0].textContent
    } else {
        return '0.0.0'
    }
}