import React from 'react'
import DPlayer from 'dplayer'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { playingStorageKey } from 'pages/videos'
import type { PlayingStorageProps } from 'pages/videos'
import { ThemedDiv } from './PageBase'
import { useLocalStorage } from 'react-use'
import { playHistoryKey } from './PlayHistory'
import type { VideoPlayHistory } from './PlayHistory'

export interface VideoPlayerProps {
    playing?: PlayingVideo;
    onEnd?: () => void;
}

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = (props) => {

    const ref = React.useRef<HTMLDivElement>()

    const [storage, setStorage] = useLocalStorage<PlayingStorageProps>(playingStorageKey);
    const [history, setHistory] = useLocalStorage<VideoPlayHistory[]>(playHistoryKey, []);

    React.useEffect(() => {
        var player: DPlayer = null;
        if (ref.current && props.playing) {

            const { url, played_time } = props.playing

            player = new DPlayer({
                container: ref.current,
                autoplay: true,
                video: {
                    url,
                    type: 'hls',
                },
            })
            if (storage && storage.url === url) {
                player.seek(storage.time)
            }
            if (played_time) {
                player.seek(played_time)
            }
            player.on('progress', () => {
                const time = player.video.currentTime
                setStorage({
                    ...props.playing,
                    time
                })
                setHistory([
                    {
                        ...props.playing,
                        played_time: time,
                        update_date: Date.now()
                    },
                    ...history.filter(
                        rec => rec.url !== url
                    )
                ])
            })
            player.on('ended', props.onEnd)
        }
        return () => {
            player?.destroy()
        }
    }, [props.playing, ref])

    const playStatus = React.useMemo<string>(() => {
        if (!props.playing) {
            return ''
        }
        const { title, episode } = props.playing
        let status = `当前播放: ${title}`
        if (episode) {
            status += ` - 第${episode}集`
        }
        return status
    }, [props.playing])

    return (
        <ThemedDiv style={{ width: '100%' }}>
            {
                props.playing ? (
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
