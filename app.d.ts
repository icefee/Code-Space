declare interface HTMLElement {
    scrollIntoViewIfNeeded(): void;
}

declare type M3u8Video = Array<number | string> | string

declare interface Video {
    title: string;
    episodes: number;
    url_template?: string;
    m3u8_list: M3u8Video[];
}

declare interface PlayingVideo {
    title: string;
    episode: number;
    url: string;
}
