declare module 'dplayer' {
    type ContextMenu = {
        text: string;
        link?: string;
        click(player: DPlayer): void;
    }
    type DPlayerOptions = {
        container: HTMLElement;
        autoplay?: boolean;
        video: {
            url: string;
            type: string;
        };
        contextmenu: ContextMenu[];
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
        play: () => void;
        pause: () => void;
        seek: (arg: number) => void;
        on: (event: string, eventHandler: (ev?: Event) => void) => void;
        switchVideo: (video: { url: string; pic?: string; thumbnails?: string; }) => void;
        destroy: () => void;
    }
}