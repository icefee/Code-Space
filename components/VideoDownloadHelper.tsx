import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Link } from '@mui/material'
import type { DialogProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledParagraph = styled('p')(({ theme }) => ({
    marginBottom: theme.spacing(1.5)
}))

const VideoDownloadHelper: React.FunctionComponent<{} & DialogProps> = ({ open, onClose }) => {
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
        >
            <DialogTitle>下载说明</DialogTitle>
            <DialogContent dividers>
                {/* <Typography component="h3" sx={{ mb: 2, fontSize: '1.2em' }}>如何将视频下载到本地</Typography> */}
                <StyledParagraph>
                    视频下载需要依赖第三方的下载工具: <Link href="/bin/video_downloader.zip">video_downloader.zip</Link>
                </StyledParagraph>
                <StyledParagraph>系统要求: Windows 7及以上</StyledParagraph>
                <StyledParagraph>步骤:</StyledParagraph>
                <StyledParagraph>
                    1.将下载工具下载到本地后解压
                </StyledParagraph>
                <StyledParagraph>
                    2.找到需要下载的视频, 右键点击选择生成下载脚本, 将下载的文件保存到解压的下载工具目录(包含文件N_m3u8DL-CLI_v2.9.9.exe)
                </StyledParagraph>
                <StyledParagraph>
                    3.双击打开生成的下载脚本文件, 视频会开始下载, 并保存在同目录下的Downloads文件夹
                </StyledParagraph>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={_ => onClose({}, 'backdropClick')}>关闭</Button>
            </DialogActions>
        </Dialog>
    )
}

export default VideoDownloadHelper
