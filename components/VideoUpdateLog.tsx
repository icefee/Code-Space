import React, { useState, useEffect, useMemo, type FunctionComponent } from 'react';
import { useLocalStorage } from 'react-use';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

type Log = {
    updateTime: string;
    log: string[];
}

const updateLogs: Log[] = [
    {
        updateTime: '2022-07-16 17:31',
        log: [
            '[欧美电影]增加加勒比海盗系列',
            '[国产剧]更新星汉灿烂、幸福到万家到最新剧集',
            '[国产电影]更新新封神姜子牙链接'
        ]
    }
]

const UpdateLog: FunctionComponent = () => {

    const [open, setOpen] = useState(false);

    const latestLog = useMemo(() => updateLogs[updateLogs.length - 1], [])

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
                <DialogContentText>{latestLog.updateTime}</DialogContentText>
                <div style={{
                    padding: '0 15px',
                    marginTop: 15
                }}>
                    <ul>
                        {
                            latestLog.log.map(
                                (log, index) => (
                                    <li key={index} style={{ lineHeight: 1.8 }}>{log}</li>
                                )
                            )
                        }
                    </ul>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleHideLog} autoFocus>好的</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateLog;
