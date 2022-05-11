import React from 'react'
import type { AppContext } from 'next/app'
import Head from 'next/head'
import css from './videos.module.css'

import { ThemeStorager } from 'components/PageBase'
import type { ThemeMode } from 'components/PageBase'

import { readFileSync } from 'fs'
import dynamic from 'next/dynamic'
import { useLocalStorage } from 'react-use'

const ResponsiveHeader = dynamic(
    () => import('components/ResponsiveHeader'),
    { ssr: false }
)

const ResponsiveVideoList = dynamic(
    () => import('components/ResponsiveVideoList'),
    { ssr: false }
)

const VideoPlayer = dynamic(
    () => import('components/VideoPlayer'),
    { ssr: false }
)

export async function getStaticProps(context: AppContext) {
    const data = readFileSync('data/videos/list.json', { encoding: 'utf-8' })
    const parsedData = JSON.parse(data) as { videos: Video[] };
    return {
        props: {
            videos: parsedData.videos
        }
    }
}

export interface PlayingStorageProps extends PlayingVideo {
    time: number;
}

export const playingStorageKey = '__video_playing'

function PlayingStorage({ setPlaying }: { setPlaying: (arg: PlayingVideo) => void; }) {
    const [storage] = useLocalStorage<PlayingStorageProps>(playingStorageKey);
    React.useEffect(() => {
        if (storage) {
            const { time, ...rest } = storage
            setPlaying(rest as PlayingVideo)
        }
    }, [storage])
    return null
}

export default class Videos extends React.PureComponent<{ videos: Video[]; }, { active?: PlayingVideo; showMenu: boolean; keyword: string; }> {

    state = {
        active: undefined,
        showMenu: true,
        keyword: ''
    }

    private onToggleMenu(): void {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    private onSearch(ev: React.FormEvent<HTMLInputElement>): void {
        const input = ev.target as HTMLInputElement
        this.setState({
            keyword: input.value
        })
    }

    private get searchedVideos(): Video[] {
        const keyword = this.state.keyword.trim()
        if (keyword === '') {
            return this.props.videos
        }
        else {
            return this.props.videos.filter(
                ({ title }) => title.indexOf(keyword) !== -1
            )
        }
    }

    public render(): JSX.Element {
        return (
            <ThemeStorager>
                {
                    ({ isDark, switchTheme }: ThemeMode) => (
                        <div className={css.container}>
                            <Head>
                                <title>视频文件夹</title>
                                <link rel="icon" href="/favicon.ico" />
                                <meta name="viewport" content="initial-scale=1, width=device-width" />
                                <script src="/hls.min.js"></script>
                            </Head>
                            <ResponsiveHeader
                                show={this.state.showMenu}
                                title="视频文件夹"
                                onToggleMenu={this.onToggleMenu.bind(this)}
                                showSearch={false}
                                onSearch={this.onSearch.bind(this)}
                                isDark={isDark}
                                onSwitchTheme={() => switchTheme(!isDark)} />
                            <div className={css.videos}>
                                <ResponsiveVideoList
                                    show={this.state.showMenu}
                                    onSearch={this.onSearch.bind(this)}
                                    onUpdateShow={(state: boolean) => this.setState({ showMenu: state })}
                                    videos={this.searchedVideos}
                                    active={this.state.active}
                                    onPlay={(active: PlayingVideo) => {
                                        this.setState({
                                            active
                                        })
                                    }}
                                />
                                <VideoPlayer playing={this.state.active} />
                            </div>
                            <PlayingStorage setPlaying={url => this.setState({ active: url })} />
                        </div>
                    )
                }
            </ThemeStorager>
        )
    }
}