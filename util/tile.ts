import { blobToFile } from './blobToFile'

export function createTileBat(args: string, title: string): void {
    const cmd = `@echo off\ntile.exe ${args}`
    const blob = new Blob([cmd], {
        type: 'text/plain;charset=ANSI',
        endings: 'native'
    })
    console.log(blob, args)
    blobToFile(blob, title + '.bat')
}