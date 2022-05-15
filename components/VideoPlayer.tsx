import React, { useState } from 'react'
import DPlayer from 'dplayer'
import { Box, Typography } from '@mui/material'
import type { PlayHistoryBaseProps } from 'components/PlayHistory'
import { ThemedDiv } from './PageBase'

export interface VideoPlayerProps extends PlayHistoryBaseProps {
    playing?: PlayingVideo;
    onEnd?: () => void;
}

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({ playing, playHistory, setPlayHistory, onEnd }) => {

    const ref = React.useRef<HTMLDivElement>()
    const [currentTime, setCurrentTime] = useState(0)

    React.useEffect(() => {
        var player: DPlayer = null;
        if (ref.current && playing) {

            const { url, played_time } = playing

            player = new DPlayer({
                container: ref.current,
                autoplay: true,
                video: {
                    url,
                    type: 'hls',
                },
            })
            if (played_time) {
                player.seek(played_time)
            }
            player.on('timeupdate', () => {
                const videoPlayedTime = player.video.currentTime
                if (videoPlayedTime > currentTime + 3) {
                    setCurrentTime(videoPlayedTime)
                }
            })
            player.on('ended', onEnd)
        }
        return () => {
            player?.destroy()
        }
    }, [playing, ref])

    React.useEffect(() => {
        if (playing && currentTime > 0) {
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
        }
    }, [currentTime, playing])

    const playStatus = React.useMemo<string>(() => {
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

// class VideoPlayer extends React.Component<VideoPlayerProps> {

//     ref: HTMLDivElement | null
//     player: any;

//     constructor(props: VideoPlayerProps) {
//         super(props);
//     }

//     handleCanplay = () => {
//         this.player.play()
//     }

//     componentDidMount() {
//         this.player = new DPlayer({
//             container: this.ref,
//             video: {
//                 url: '',
//                 type: 'hls',
//             },
//         })
//         this.player.on('canplay', this.handleCanplay)
//     }

//     componentWillUnmount() {
//         // this.player.off('canplay', this.handleCanplay)
//     }

//     componentDidUpdate(props: VideoPlayerProps) {
//         if (this.props.playing) {
//             this.player.switchVideo({
//                 url: getM3u8Uri(this.props.playing)
//             })
//             this.player.play()
//         }
//     }

//     /**
//      * render
//      */
//     public render(): JSX.Element {
//         return (
//             <div style={{ width: '100%' }}>
//                 <div id="player" ref={ref => this.ref = ref} style={{ height: '100%' }} />
//             </div>
//         )
//     }
// }

export default VideoPlayer;
