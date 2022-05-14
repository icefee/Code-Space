declare interface HTMLElement {
    scrollIntoViewIfNeeded(): void;
}

declare type M3u8Video = Array<number | string> | string

declare interface Section {
    section: string;
    series: Video[]
}

declare interface Episode {
    title: string;
    episodes: number;
    url_template?: string;
    m3u8_list: M3u8Video[];
}

declare interface Film {
    title: string;
    m3u8_url: string;
}

declare type Video = Episode | Film

declare interface PlayingVideo {
    title: string;
    episode?: number;
    url: string;
    played_time?: number;
}

declare interface VideoPlayHistory extends PlayingVideo {
    played_time: number;
    update_date: number;
}
