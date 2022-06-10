export function blobToFile(blob: Blob, fileName: string): void {
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(blob)
    anchor.download = fileName
    anchor.click()

    URL.revokeObjectURL(anchor.href)
    anchor.remove()
}
