import React from 'react'
import DPlayer from 'dplayer'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { playingStorageKey } from 'pages/videos'
import type { PlayingVideo, PlayingStorageProps } from 'pages/videos'
import { ThemedDiv } from './PageBase'
import { useLocalStorage } from "react-use"

type VideoPlayerProps = { playing?: PlayingVideo }

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = (props) => {

    const ref = React.useRef<HTMLDivElement>()

    const [storage, setStorage] = useLocalStorage<PlayingStorageProps>(playingStorageKey);

    React.useEffect(() => {
        var player: DPlayer = null;
        if (ref.current && props.playing) {
            player = new DPlayer({
                container: ref.current,
                autoplay: true,
                video: {
                    url: props.playing.url,
                    type: 'hls',
                },
            })
            if (storage && storage.url === props.playing.url) {
                player.seek(storage.time)
            }
            player.on('timeupdate', () => {
                setStorage({
                    ...props.playing,
                    time: player.video.currentTime
                })
            })
        }
        return () => {
            player?.destroy()
        }
    }, [props.playing, ref])

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
                        >当前播放: {props.playing.title} - 第{props.playing.episode}集</Typography>
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
