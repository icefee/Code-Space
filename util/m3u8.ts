import { saveAs } from './FileSaver'

export function createDownloadBat(url: string, title: string): void {
    const cmd = `@echo off\nN_m3u8DL-CLI_v2.9.9.exe "${url}" --workDir "./Downloads" --saveName "${encodeURIComponent(title)}" --enableDelAfterDone`
    const blob = new Blob([cmd], {
        type: 'text/plain;charset=ANSI',
        endings: 'native'
    })
    saveAs(blob, title + '.bat')
}
