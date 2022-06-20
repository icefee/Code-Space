import React, { useState } from 'react'
import type { AppContext } from 'next/app'
import Head from 'next/head'
import css from './videos.module.css'
import { SnackbarProvider } from 'util/useSnackbar'
import { ThemeStorager } from 'components/PageBase'
import type { ThemeMode } from 'components/PageBase'

import { readFileSync } from 'fs'
import dynamic from 'next/dynamic'
import { useLocalStorage } from 'react-use'
import { getM3u8Uri } from 'components/VideoList'

import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'

import SectionEdit from 'components/SectionEdit'
import PlayHistory from 'components/PlayHistory'
import type { PlayHistoryBaseProps } from 'components/PlayHistory'

import VideoDownloadHelper from 'components/VideoDownloadHelper'
import QuickAction from 'components/QuickAction'

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

interface PlayingStateProps extends PlayHistoryBaseProps {
    onRestore(history: PlayingVideo): void;
}

const PlayingStateRestorer: React.FunctionComponent<PlayingStateProps> = ({ playHistory, onRestore }) => {
    React.useEffect(() => {
        if (playHistory.length > 0) {
            const [lastPlay] = playHistory
            onRestore(lastPlay as PlayingVideo)
        }
    }, [])
    return null
}

interface VideosState {
    activeVideo?: PlayingVideo;
    showMenu: boolean;
    keyword: string;
    anchorEl: HTMLElement | null;
    sectionEditOpen: boolean;
    activeSectionsIndex: number[];
    playHistoryOpen: boolean;
    downloadHelpderOpen: boolean;
}

type ActiveSectionIndex = VideosState['activeSectionsIndex']

const activeSectionsStorageKey = '__active_sections'

function ActiveSectionsStorage({ activeSections, updateActiveSections }: { activeSections: ActiveSectionIndex; updateActiveSections: (arg: ActiveSectionIndex) => void }) {
    const [storage, setStorage] = useLocalStorage<ActiveSectionIndex>(activeSectionsStorageKey);
    React.useEffect(() => {
        if (storage) {
            updateActiveSections(storage)
        }
    }, [])
    React.useEffect(() => {
        setStorage(activeSections)
    }, [activeSections])
    return null
}

const playHistoryKey = '__playing_history'

const HistoryStorage: React.FunctionComponent<{
    children: (props: { playHistory: VideoPlayHistory[], setPlayHistory: React.Dispatch<React.SetStateAction<VideoPlayHistory[]>> }) => React.ReactElement;
}> = ({ children }) => {
    const [storage, setStorage] = useLocalStorage<VideoPlayHistory[]>(playHistoryKey, [])
    const [playHistory, setPlayHistory] = useState<VideoPlayHistory[]>(storage)
    React.useEffect(() => {
        setStorage(playHistory)
    }, [playHistory])
    return children({ playHistory, setPlayHistory })
}

export default class Videos extends React.PureComponent<{ videos: Section[]; }, VideosState> {

    state: VideosState = {
        activeVideo: undefined,
        showMenu: true,
        keyword: '',
        anchorEl: null,
        sectionEditOpen: false,
        activeSectionsIndex: [0, 1, 2],
        playHistoryOpen: false,
        downloadHelpderOpen: false
    }

    private onToggleMenu(): void {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    private get isMenuOpen(): boolean {
        return Boolean(this.state.anchorEl)
    }

    private closeMenu(): void {
        this.setState({ anchorEl: null })
    }

    private menuActionWithClose(callback: () => void): () => void {
        return () => {
            this.closeMenu()
            callback()
        }
    }

    private handleMenuAction(menuIndex: number): void {
        if (menuIndex === 0) {
            this.setState({
                sectionEditOpen: true
            })
        }
        else if (menuIndex === 1) {
            this.setState({
                playHistoryOpen: true
            })
        }
        else if (menuIndex === 2) {
            this.setState({
                downloadHelpderOpen: true
            })
        }
    }

    private onSearch(ev: React.FormEvent<HTMLInputElement>): void {
        const input = ev.target as HTMLInputElement
        this.setState({
            keyword: input.value
        })
    }

    private get activeSections(): Section[] {
        return this.props.videos.filter(
            (_, sectionIndex) => this.state.activeSectionsIndex.includes(sectionIndex)
        )
    }

    private get searchedVideos(): Section[] {
        const keyword = this.state.keyword.trim()
        if (keyword === '') {
            return this.activeSections
        }
        else {
            return this.activeSections.map(
                ({ series, ...rest }) => ({
                    series: series.filter(
                        ({ title }) => title.indexOf(keyword) !== -1
                    ),
                    ...rest
                })
            ).filter(({ series }) => series.length > 0)
        }
    }

    private playFromHistory(history: VideoPlayHistory) {
        const { activeVideo } = this.state
        if (
            !activeVideo ||
            activeVideo && (
                activeVideo.url !== history.url
            )
        ) {
            this.setState({
                activeVideo: history as PlayingVideo
            })
        }
    }

    private get activeEpisode(): Episode {
        if (!this.state.activeVideo) {
            return null
        }
        return this.props.videos.reduce(
            (pre, cur) => {
                return [
                    ...pre,
                    ...cur.series.filter(
                        ep => 'episodes' in ep
                    )
                ]
            },
            []
        ).find(
            (ep: Episode) => ep.title === this.state.activeVideo.title
        )
    }

    private playNext(key: 1 | -1) {
        if (this.state.activeVideo) {
            const { title, episode } = this.state.activeVideo
            if (episode !== undefined) {
                const { episodes, url_template, m3u8_list } = this.activeEpisode
                const nextEpisode = Math.max(Math.min(episode + key, episodes), 1)
                this.setState({
                    activeVideo: {
                        title,
                        episode: nextEpisode,
                        url: getM3u8Uri(url_template, m3u8_list[nextEpisode - 1])
                    }
                })
            }
        }
    }

    private handleQuickAction(key: string): void {
        if (key === 'prev') {
            this.playNext(-1)
        }
        else if (key === 'next') {
            this.playNext(1)
        }
    }

    private get quickAction() {
        const { activeVideo, showMenu } = this.state
        if (!activeVideo) {
            return {
                hidden: true
            }
        }
        const { episode } = activeVideo
        if (!episode) {
            return {
                hidden: true
            }
        }
        const { episodes } = this.activeEpisode
        return {
            first: episode === 1,
            last: episode === episodes,
            hidden: showMenu
        }
    }

    public render(): JSX.Element {
        return (
            <ThemeStorager>
                {
                    ({ isDark, switchTheme }: ThemeMode) => (
                        <HistoryStorage>
                            {
                                ({ playHistory, setPlayHistory }) => (
                                    <SnackbarProvider>
                                        <div className={css.container}>
                                            <Head>
                                                <title>视频文件夹</title>
                                                <link rel="icon" href="/favicon.ico" />
                                                <meta name="viewport" content="initial-scale=1, width=device-width" />
                                                <script defer src="/hls.min.js"></script>
                                            </Head>
                                            <ResponsiveHeader
                                                show={this.state.showMenu}
                                                title="视频文件夹"
                                                onToggleMenu={this.onToggleMenu.bind(this)}
                                                showSearch={false}
                                                onSearch={this.onSearch.bind(this)}
                                                isDark={isDark}
                                                extendButtons={
                                                    <Box>
                                                        <IconButton
                                                            size="large"
                                                            onClick={(event: React.MouseEvent<HTMLElement>) => this.setState({ anchorEl: event.currentTarget })}
                                                            color="inherit"
                                                        >
                                                            <SettingsIcon />
                                                        </IconButton>
                                                    </Box>
                                                }
                                                onSwitchTheme={() => switchTheme(!isDark)} />
                                            <Menu
                                                anchorEl={this.state.anchorEl}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={this.isMenuOpen}
                                                onClose={this.closeMenu.bind(this)}
                                            >
                                                {
                                                    ['编辑栏目', '历史记录', '下载到本地'].map(
                                                        (label, menuIndex) => (
                                                            <MenuItem key={menuIndex} onClick={this.menuActionWithClose(() => this.handleMenuAction(menuIndex)).bind(this)}>{label}</MenuItem>
                                                        )
                                                    )
                                                }
                                            </Menu>
                                            <SectionEdit
                                                sections={this.props.videos}
                                                activeSections={this.state.activeSectionsIndex}
                                                activeSectionsChange={
                                                    (activeSectionsIndex) => this.setState({
                                                        activeSectionsIndex
                                                    })
                                                }
                                                open={this.state.sectionEditOpen}
                                                onClose={_ => this.setState({ sectionEditOpen: false })}
                                            />
                                            <PlayHistory
                                                playHistory={playHistory}
                                                setPlayHistory={setPlayHistory}
                                                open={this.state.playHistoryOpen}
                                                onClose={_ => this.setState({ playHistoryOpen: false })}
                                                onPlay={this.playFromHistory.bind(this)}
                                            />
                                            <div className={css.videos}>
                                                <ResponsiveVideoList
                                                    show={this.state.showMenu}
                                                    onSearch={this.onSearch.bind(this)}
                                                    onUpdateShow={(state: boolean) => this.setState({ showMenu: state })}
                                                    videos={this.searchedVideos}
                                                    active={this.state.activeVideo}
                                                    onPlay={(activeVideo: PlayingVideo, env) => {
                                                        this.setState({
                                                            activeVideo,
                                                            showMenu: !(env && env.mobile)
                                                        })
                                                    }}
                                                />
                                                <Box sx={{ position: 'relative', width: '100%' }}>
                                                    <VideoPlayer
                                                        playHistory={playHistory}
                                                        setPlayHistory={setPlayHistory}
                                                        playing={this.state.activeVideo}
                                                        onEnd={() => this.playNext(1)}
                                                        requestReload={
                                                            () => this.setState(({ activeVideo }) => {
                                                                const tr = new Reg(`(?<=#)\d{13}$`)
                                                                const ts = String(Date.now())
                                                                const url = activeVideo.url.match(tr) ? activeVideo.url.replace(tr, ts) : `${activeVideo.url}#${ts}`
                                                                return {
                                                                    activeVideo: {
                                                                        ...activeVideo,
                                                                        url
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                    <QuickAction onAction={this.handleQuickAction.bind(this)} {...this.quickAction} />
                                                </Box>
                                            </div>
                                            <PlayingStateRestorer
                                                playHistory={playHistory}
                                                onRestore={(activeVideo: PlayingVideo) => {
                                                    this.setState({
                                                        activeVideo
                                                    })
                                                }}
                                            />
                                            <ActiveSectionsStorage
                                                activeSections={this.state.activeSectionsIndex}
                                                updateActiveSections={
                                                    (activeSectionsIndex) => this.setState({
                                                        activeSectionsIndex
                                                    })
                                                }
                                            />
                                            <VideoDownloadHelper open={this.state.downloadHelpderOpen} onClose={_ => this.setState({ downloadHelpderOpen: false })} />
                                        </div>
                                    </SnackbarProvider>
                                )
                            }
                        </HistoryStorage>
                    )
                }
            </ThemeStorager>
        )
    }
}
