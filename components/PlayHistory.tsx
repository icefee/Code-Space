import React from 'react'
import { Dialog, DialogContent, DialogActions, DialogTitle, Box, List, Typography, Avatar, ListItemText, ListItemAvatar, Button } from '@mui/material'
import type { DialogProps } from '@mui/material'
import { useLocalStorage } from 'react-use'
import { StyledListItemButton } from 'components/Menu'
import {
    SlowMotionVideo as SlowMotionVideoIcon
} from '@mui/icons-material'

import { formatDate, timeFormatter } from 'util/date'

export interface VideoPlayHistory extends PlayingVideo {
    played_time: number;
    update_date: number;
}

interface PlayHistoryProps {
    onPlay: (arg: VideoPlayHistory) => void;
}

export const playHistoryKey = '__playing_history'

const PlayHistory = React.forwardRef<{ clearHistory: () => void; }, PlayHistoryProps & DialogProps>(
    function PlayHistoryList({ onClose, onPlay }, ref) {
        const [storage, setStorage] = useLocalStorage<VideoPlayHistory[]>(playHistoryKey, []);
        const playHistory = (history: VideoPlayHistory) => {
            onClose({}, 'escapeKeyDown')
            onPlay(history)
        }
        const historyTitle = ({ title, episode }: VideoPlayHistory) => {
            return (episode ? `${title} - 第${episode}集` : title)
        }
        React.useImperativeHandle(ref, () => ({
            clearHistory: () => setStorage([])
        }));
        return (
            <>
                {
                    storage.length > 0 ? (
                        <List disablePadding>
                            {
                                storage.map(
                                    (history: VideoPlayHistory, index: number) => (
                                        <StyledListItemButton
                                            key={index}
                                            dense
                                            onClick={_ => playHistory(history)}
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
    return (
        <Dialog scroll="paper" open={props.open} onClose={props.onClose}>
            <DialogTitle>历史记录</DialogTitle>
            <DialogContent>
                <PlayHistory {...props} ref={ref} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={() => {
                    if (ref.current) {
                        ref.current.clearHistory()
                    }
                }}>清空历史记录</Button>
                <Button onClick={_ => props.onClose({}, 'escapeKeyDown')}>关闭</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PlayHistoryDialog
