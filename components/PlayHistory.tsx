import React from 'react'
import { Dialog, DialogContent, DialogActions, DialogTitle, Box, List, Typography, Avatar, ListItemText, ListItemAvatar, Button } from '@mui/material'
import type { DialogProps } from '@mui/material'
import { StyledListItemButton } from 'components/Menu'
import {
    SlowMotionVideo as SlowMotionVideoIcon
} from '@mui/icons-material'

import { formatDate, timeFormatter } from 'util/date'

export interface PlayHistoryBaseProps {
    playHistory: VideoPlayHistory[];
    setPlayHistory?: React.Dispatch<React.SetStateAction<VideoPlayHistory[]>>;
}

interface PlayHistoryProps extends PlayHistoryBaseProps {
    onPlay: (arg: VideoPlayHistory) => void;
}

const PlayHistory = React.forwardRef<{ clearHistory: () => void; }, PlayHistoryProps & DialogProps>(
    function PlayHistoryList({ playHistory, onClose, onPlay }, ref) {
        const playFromHistory = (history: VideoPlayHistory) => {
            onClose({}, 'escapeKeyDown')
            onPlay(history)
        }
        const historyTitle = ({ title, episode }: VideoPlayHistory) => {
            return (episode ? `${title} - 第${episode}集` : title)
        }
        React.useImperativeHandle(ref, () => ({
            clearHistory: null// () => setStorage([])
        }));
        return (
            <>
                {
                    playHistory.length > 0 ? (
                        <List disablePadding>
                            {
                                playHistory.map(
                                    (history: VideoPlayHistory, index: number) => (
                                        <StyledListItemButton
                                            key={index}
                                            dense
                                            onClick={_ => playFromHistory(history)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <SlowMotionVideoIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={historyTitle(history)} secondary={timeFormatter(Math.round(history.played_time)) + ' · ' + formatDate(history.update_date, 'MM/DD HH:mm')} />
                                        </StyledListItemButton>
                                    )
                                )
                            }
                        </List>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                            <Typography variant="caption" component="div" sx={{ fontSize: '1em' }}>
                                暂无播放记录
                            </Typography>
                        </Box>
                    )
                }
            </>
        )
    }
)

const PlayHistoryDialog: React.FunctionComponent<PlayHistoryProps & DialogProps> = props => {
    const ref = React.useRef<{ clearHistory: () => void; } | null>(null)
    const closeDialog = () => {
        props.onClose({}, 'escapeKeyDown')
    }
    return (
        <Dialog scroll="paper" open={props.open} onClose={props.onClose}>
            <DialogTitle>历史记录</DialogTitle>
            <DialogContent dividers>
                <PlayHistory {...props} ref={ref} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" disabled={props.playHistory.length === 0} color="error" onClick={() => {
                    props.setPlayHistory([])
                    closeDialog()
                }}>清空历史记录</Button>
                <Button onClick={_ => closeDialog()}>关闭</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PlayHistoryDialog
