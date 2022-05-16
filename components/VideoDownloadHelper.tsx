import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Link, Alert, AlertTitle } from '@mui/material'
import type { DialogProps } from '@mui/material'

const VideoDownloadHelper: React.FunctionComponent<{} & DialogProps> = ({ open, ...props }) => {
    return (
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    width: '80%',
                    maxHeight: 450
                }
            }}
            maxWidth="xs"
            open={open}
            { ...props }
        >
            <DialogTitle>下载说明</DialogTitle>
            <DialogContent dividers>
                {/* <Typography component="h3" sx={{ mb: 2, fontSize: '1.2em' }}>如何将视频下载到本地</Typography> */}
                <Typography gutterBottom>
                    视频下载需要依赖第三方的下载工具: <Link href="/bin/video_downloader.zip">video_downloader.zip</Link>
                </Typography>
                <Typography gutterBottom>系统要求: Windows 7及以上</Typography>
                <Typography gutterBottom>步骤:</Typography>
                <Typography gutterBottom>
                    1.将下载工具下载到本地后解压
                </Typography>
                <Typography gutterBottom>
                    2.找到需要下载的视频, 右键点击 选择"生成下载脚本", 将下载的文件保存到解压的下载工具目录(包含文件N_m3u8DL-CLI_v2.9.9.exe)
                </Typography>
                <Typography gutterBottom>
                    3.双击打开生成的下载脚本文件, 视频会开始下载, 并保存在同目录下的Downloads文件夹
                </Typography>
                <Alert severity="warning" sx={{mb: 2}}>如果下载的脚本被系统阻止运行, 请选择仍要运行</Alert>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={_ => props.onClose({}, 'backdropClick')}>关闭</Button>
            </DialogActions>
        </Dialog>
    )
}

export default VideoDownloadHelper
