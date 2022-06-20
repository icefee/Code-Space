import React, { useState, useEffect, useRef, useMemo } from 'react'
import DPlayer from 'dplayer'
import { Box, Typography, Alert } from '@mui/material'
import type { PlayHistoryBaseProps } from 'components/PlayHistory'
import { ThemedDiv } from './PageBase'
import { createDownloadBat } from 'util/m3u8'
import { SnackbarContext } from 'util/useSnackbar'
import type { SnackbarContextProps } from 'util/useSnackbar'

export interface VideoPlayerProps extends PlayHistoryBaseProps {
    playing?: PlayingVideo;
    onEnd?: () => void;
    requestReload?: () => void;
}

/*
const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({ playing, setPlayHistory, onEnd }) => {

    const ref = useRef<HTMLDivElement>()
    const [currentTime, setCurrentTime] = useState(0)
    const timeRef = useRef<number>(currentTime);

    useEffect(() => {
        var player: DPlayer = null;
        if (ref.current && playing) {

            const { url, title, episode, played_time } = playing

            player = new DPlayer({
                container: ref.current,
                autoplay: true,
                video: {
                    url,
                    type: 'hls',
                },
                contextmenu: [
                    {
                        text: '生成下载脚本',
                        click: (_player) => {
                            createDownloadBat(
                                url,
                                episode ? `${title}_${episode}` : title
                            )
                        },
                    }
                ]
            })
            if (played_time) {
                player.seek(played_time)
            }
            player.on('timeupdate', () => setCurrentTime(player.video.currentTime))
            player.on('seeked', () => timeRef.current = 0)
            player.on('ended', onEnd)
        }
        return () => {
            player?.destroy()
        }
    }, [playing, ref])

    useEffect(() => {
        if (playing) {
            timeRef.current = 0
            setCurrentTime(0)
        }
    }, [playing])

    useEffect(() => {
        if (playing && currentTime > timeRef.current + 3) {
            setPlayHistory(history => [
                {
                    ...playing,
                    played_time: currentTime,
                    update_date: Date.now()
                },
                ...history.filter(
                    rec => rec.url !== playing.url
                )
            ])
            timeRef.current = currentTime
        }
    }, [currentTime, playing])

    const playStatus = useMemo<string>(() => {
        if (!playing) {
            return ''
        }
        const { title, episode } = playing
        let status = `当前播放: ${title}`
        if (episode) {
            status += ` - 第${episode}集`
        }
        return status
    }, [playing])

    return (
        <ThemedDiv style={{ width: '100%' }}>
            {
                playing ? (
                    <Box sx={{ position: 'relative', height: '100%' }}>
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                color: '#ccc',
                                zIndex: 1
                            }}
                        >{playStatus}</Typography>
                        <div id="player" ref={ref} style={{ height: '100%' }} />
                    </Box>
                ) : (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#aaa'
                    }}>
                        <Typography variant="h5" component="div">
                            选择一个视频播放
                        </Typography>
                    </Box>
                )
            }
        </ThemedDiv>
    )
}
*/

class VideoPlayer extends React.Component<VideoPlayerProps> {

    private ref: React.RefObject<HTMLDivElement | null>
    private player?: DPlayer
    private prevPlayTime: number = 0
    // private reloadTimeout: NodeJS.Timeout | null = null
    // private reloadingTimeout: boolean = false
    // private playerDestroyed: boolean = false
    private isAbort = false

    constructor(props: VideoPlayerProps) {
        super(props)

        this.ref = React.createRef<HTMLDivElement | null>()
    }

    public componentDidMount(): void {
        if (this.props.playing) {
            this.initPlayer(this.props.playing)
        }
    }

    public componentDidUpdate(prevProps: VideoPlayerProps): void {

        if (this.props.playing !== prevProps.playing) {
            this.isAbort = true
            if (this.player) {
                this.prevPlayTime = 0
                this.destroyPlayer()
            }
            // this.destroyReloadTimeout()
            this.initPlayer(this.props.playing)
        }
    }

    private initPlayer({ url, title, episode, played_time }: PlayingVideo): void {
        const player = new DPlayer({
            container: this.ref.current,
            autoplay: true,
            video: {
                url,
                type: 'hls',
            },
            contextmenu: [
                {
                    text: '生成下载脚本',
                    click: (_player) => {
                        createDownloadBat(
                            url,
                            episode ? `${title}_${episode}` : title
                        )
                    },
                }
            ]
        })
        if (played_time) {
            player.seek(played_time)
        }
        player.on('timeupdate', () => this.onTimeupdate())
        player.on('seeked', () => this.onSeeked())
        player.on('ended', () => this.onEnded())
        player.on('error', (error) => {
            /*
            if (!this.reloadingTimeout && !this.playerDestroyed) {
                this.reloadingTimeout = true;
                (this.context as SnackbarContextProps).showSnackbar({
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    message: '视频加载失败, 正在重新加载..',
                    autoHideDuration: 2500
                })
                this.reloadTimeout = setTimeout(() => {
                    this.props.requestReload?.()
                }, 1e4);
            }
            */
            if (!this.isAbort) {
                (this.context as SnackbarContextProps).showSnackbar({
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center'
                    },
                    children: (
                        <Alert severity="error">视频源连接失败, 请尝试观看其他的视频</Alert>
                    ),
                    // message: '视频加载失败, 正在重新加载..',
                    autoHideDuration: 5000
                })
            }
        })
        this.player = player
        // this.playerDestroyed = false

        requestAnimationFrame(() => {
            this.isAbort = false
        })
    }

    private destroyPlayer(): void {
        this.player?.destroy()
        // this.playerDestroyed = true
    }

    /*
    private destroyReloadTimeout() {
        if (this.reloadTimeout) {
            clearTimeout(this.reloadTimeout)
        }
    }
    */

    /**
     * componentWillUnmount: void
    **/
    public componentWillUnmount(): void {
        this.destroyPlayer()
        // this.destroyReloadTimeout()
    }

    private onTimeupdate(): void {
        const currentTime = this.player.video.currentTime;
        if (currentTime > this.prevPlayTime + 3) {
            const { playing, playHistory, setPlayHistory } = this.props
            setPlayHistory([
                {
                    ...playing,
                    played_time: currentTime,
                    update_date: Date.now()
                },
                ...playHistory.filter(
                    rec => rec.url !== playing.url
                )
            ])
            this.prevPlayTime = currentTime
        }
    }

    private onSeeked(): void {
        this.prevPlayTime = this.player.video.currentTime
    }

    private onEnded(): void {
        this.props.onEnd?.()
    }

    private get playStatus() {
        if (!this.props.playing) {
            return ''
        }
        const { title, episode } = this.props.playing
        let status = `当前播放: ${title}`
        if (episode) {
            status += ` - 第${episode}集`
        }
        return status
    }

    static contextType: React.Context<SnackbarContextProps> = SnackbarContext

    /**
     * render
     */
    public render() {
        return (
            <ThemedDiv sx={{ width: '100%', height: '100%' }}>
                {
                    this.props.playing ? (
                        <Box sx={{ position: 'relative', height: '100%' }}>
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    left: 5,
                                    color: '#ccc',
                                    zIndex: 1
                                }}
                            >{this.playStatus}</Typography>
                            <div id="player" ref={this.ref} style={{ height: '100%' }} />
                        </Box>
                    ) : (
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#aaa'
                        }}>
                            <Typography variant="h5" component="div">
                                选择一个视频播放
                            </Typography>
                        </Box>
                    )
                }
            </ThemedDiv>
        )
    }
}

export default VideoPlayer;
