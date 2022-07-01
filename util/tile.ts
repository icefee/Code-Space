import { blobToFile } from './blobToFile'

/*
@echo off&color 2
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "%~dp0"
*/

export function createTileBat(args: string, title: string): void {
    const cmd = `@echo off&color 2\n%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit\ncd /d "%~dp0"\ntile.exe ${args}\npause`
    const blob = new Blob([cmd], {
        type: 'text/plain;charset=ANSI',
        endings: 'native'
    })
    blobToFile(blob, title + '.bat')
}