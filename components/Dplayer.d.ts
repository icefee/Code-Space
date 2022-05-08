declare module 'dplayer' {
    type DPlayerOptions = {
        container: HTMLElement;
        autoplay?: boolean;
        video: {
            url: string;
            type: string;
        }
    }
    export default class DPlayer {
        constructor(options: DPlayerOptions) {}
    }
}