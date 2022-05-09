import React from 'react'
import DPlayer from 'dplayer'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import type { M3u8Video } from 'pages/videos'
import { ThemedDiv } from './PageBase'

type VideoPlayerProps = { playing?: string }

const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = (props) => {

    const ref = React.useRef<HTMLDivElement>()

    React.useEffect(() => {
        var player = null;
        if (ref.current && props.playing) {
            player = new DPlayer({
                container: ref.current,
                autoplay: true,
                video: {
                    url: props.playing,
                    type: 'hls',
                },
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
                    <div id="player" ref={ref} style={{ height: '100%' }} />
                ) : (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#aaa'
                    }}>
                        <Typography variant="h4" gutterBottom component="div">
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
