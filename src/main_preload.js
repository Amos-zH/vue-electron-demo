// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
import {app} from 'electron'

global.electron = require('electron');
window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('electron').remote;
window.fileSys = require('fs')
window.process = require('child_process')
