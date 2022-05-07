import React from 'react'
import type { M3u8Video } from '../pages/videos'
import DPlayer from 'dplayer'

const getM3u8Uri = ({ id, sign }: M3u8Video) => {
    return `https://b.baobuzz.com/m3u8/${id}.m3u8?sign=${sign}`
}

type VideoPlayerProps = { playing?: M3u8Video }

const VideoPlayer: React.FunctionComponent<{ playing?: M3u8Video }> = (props) => {

    const ref = React.useRef<HTMLDivElement>()

    React.useEffect(() => {
        var player = null;
        if (ref.current && props.playing) {
            player = new DPlayer({
                container: ref.current,
                autoplay: true,
                video: {
                    url: getM3u8Uri(props.playing),
                    type: 'hls',
                },
            })
        }
        return () => {
            player?.destroy()
        }
    }, [props.playing, ref])

    return (
        <div style={{ width: '100%' }}>
            <div id="player" ref={ref} style={{ height: '100%' }} />
        </div>
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
