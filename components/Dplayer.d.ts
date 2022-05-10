declare module 'dplayer' {
    type DPlayerOptions = {
        container: HTMLElement;
        autoplay?: boolean;
        video: {
            url: string;
            type: string;
        }
    }
    // interface DPlayer {
    //     seek: (arg: number) => void;
    // }
    interface Video {
        currentTime: number;
    }
    export default class DPlayer {
        video: Video;
        // new(options: DPlayerOptions): DPlayer;
        constructor(options: DPlayerOptions): DPlayer;
        seek: (arg: number) => void;
        on: (event: string, eventHandler: (ev?: Event) => void) => void;
        destroy: () => void;
    }
}