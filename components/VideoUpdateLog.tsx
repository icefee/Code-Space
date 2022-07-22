import React, { useState, useEffect, useMemo, type FunctionComponent } from 'react';
import { useLocalStorage } from 'react-use';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

type Log = {
    updateTime: string;
    log: string[];
}

const updateLogs: Log[] = [
    {
        updateTime: '2022-07-22 12:30',
        log: [
            '[播放器]增加快捷菜单微调播放进度, 快进或快退15秒',
            '[国产剧]增加了一些剧集, 更新部分剧集到最新更新'
        ]
    },
    {
        updateTime: '2022-07-18 08:54',
        log: [
            '[播放器]更换Hls支持库, 解决部分视频无法播放的问题'
        ]
    },
    {
        updateTime: '2022-07-17 11:00',
        log: [
            '[播放器]增加触摸设备滑动控制播放进度',
            '[播放器]增加双击播放/暂停'
        ]
    },
    {
        updateTime: '2022-07-16 17:31',
        log: [
            '[欧美电影]增加加勒比海盗系列',
            '[国产剧]更新星汉灿烂、幸福到万家到最新剧集',
            '[国产电影]更新新封神姜子牙链接'
        ]
    },
]

const UpdateLog: FunctionComponent = () => {

    const [open, setOpen] = useState(false);

    const latestLog = useMemo(() => updateLogs[0], [])

    const [logRead, setLogRead] = useLocalStorage<boolean>(latestLog.updateTime, false)

    const handleClose = () => {
        setOpen(false);
    }

    const handleHideLog = () => {
        setLogRead(true);
        handleClose();
    }

    useEffect(() => {
        if (!logRead) {
            setOpen(true);
        }
    }, [logRead])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>本次更新</DialogTitle>
            <DialogContent>
                {
                    updateLogs.map(
                        ({ log, updateTime }, index) => (
                            <div key={index} style={{ marginBottom: 20 }}>
                                <DialogContentText>{updateTime}</DialogContentText>
                                <div style={{
                                    padding: '0 20px',
                                }}>
                                    <ul>
                                        {
                                            log.map(
                                                (log, index) => (
                                                    <li key={index} style={{ lineHeight: 1.6 }}>{log}</li>
                                                )
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        )
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleHideLog} autoFocus>好的</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateLog;
