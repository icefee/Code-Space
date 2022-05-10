import React from "react";
import type { AppContext } from "next/app"
import Head from "next/head"
import css from './videos.module.css'

import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { IconButton } from "@mui/material";
import {
    MovieFilterOutlined as MovieFilterOutlinedIcon,
    SlideshowOutlined as SlideshowOutlinedIcon,
    Menu as MenuIcon
} from '@mui/icons-material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import Zoom from '@mui/material/Zoom'

import { ThemeStorager } from 'components/PageBase'
import type { ThemeMode } from 'components/PageBase'
import Header, { SearchBar } from 'components/Header'
import type { HeaderProps } from 'components/Header'
import { StyledListItemButton } from 'components/Menu'

import { StickyCollapsebleList } from 'components/Menu'
import { readFileSync } from 'fs'
import dynamic from 'next/dynamic'
import { useLocalStorage } from "react-use"

const VideoPlayer = dynamic(
    () => import('components/VideoPlayer'),
    { ssr: false }
)

export type M3u8Video = Array<number | string> | string

export type Video = {
    title: string;
    episodes: number;
    url_template?: string;
    m3u8_list: M3u8Video[];
}

export interface PlayingVideo {
    title: string;
    episode: number;
    url: string;
}

interface VideoListProps {
    videos: Video[];
    onPlay: (arg: PlayingVideo) => void;
    active?: PlayingVideo;
}

const getM3u8Uri: (url_template: string, m3u8: M3u8Video) => string = (url_template, m3u8) => {
    if (typeof m3u8 === 'string') {
        return m3u8
    }
    else {
        return m3u8.reduce(
            (prev, current, i) => {
                return String(prev).replace(new RegExp('\\{' + i + '\\}', 'g'), String(current))
            },
            url_template
        ) as string
    }
}

class VideoList extends React.Component<VideoListProps> {

    private get activeM3u8Id(): string {
        return this.props.active ? this.props.active.url : ''
    }

    private getSelectedState(url_template: string, m3u8: M3u8Video): boolean {
        if (typeof m3u8 === 'string') {
            return this.activeM3u8Id === m3u8
        }
        return this.activeM3u8Id === getM3u8Uri(url_template, m3u8)
    }

    /**
     * render
 : JSX.Element    */
    public render(): JSX.Element {
        return (
            <List
                sx={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    maxWidth: 250,
                    bgcolor: 'background.paper',
                    ...(this.props.videos.length === 0 && {
                        display: 'flex',
                        flexFlow: 'column nowrap'
                    })
                }}
                component="nav"
                subheader={
                    <ListSubheader component="div">视频文件夹</ListSubheader>
                }
            >
                {
                    this.props.videos.length > 0 ? this.props.videos.map(
                        ({ title, episodes, m3u8_list, url_template }, i) => (
                            <StickyCollapsebleList
                                label={title}
                                icon={<MovieFilterOutlinedIcon />}
                                key={i}
                                defaultCollapsed={this.props.active && this.props.active.title === title}>
                                {
                                    Array.from(
                                        { length: episodes }
                                    ).map(
                                        (_, j) => (
                                            <StyledListItemButton
                                                key={j}
                                                sx={{ pl: 4 }}
                                                selected={this.getSelectedState(url_template, m3u8_list[j])}
                                                onClick={_ => this.props.onPlay({
                                                    url: getM3u8Uri(url_template, m3u8_list[j]),
                                                    title,
                                                    episode: j + 1
                                                })}
                                            >
                                                <ListItemIcon>
                                                    <SlideshowOutlinedIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`第${j + 1}集`} />
                                            </StyledListItemButton>
                                        )
                                    )
                                }
                            </StickyCollapsebleList>
                        )
                    ) : (
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#aaa'
                        }}>
                            <Typography variant="caption" component="div" sx={{ fontSize: '1em' }}>
                                暂无满足条件的视频
                            </Typography>
                        </Box>
                    )
                }
            </List>
        )
    }
}

export async function getStaticProps(context: AppContext) {
    const data = readFileSync('data/videos/list.json', { encoding: 'utf-8' })
    const parsedData = JSON.parse(data) as { videos: Video[] };
    return {
        props: {
            videos: parsedData.videos
        }
    }
}

interface ResponsiveVideoListProps extends VideoListProps {
    show: boolean;
    onUpdateShow: (arg: boolean) => void;
    onSearch: React.ChangeEventHandler<HTMLInputElement>;
}

const ResponsiveVideoList: React.FunctionComponent<ResponsiveVideoListProps> = ({ show, onUpdateShow, onSearch, ...rest }) => {
    const matches = useMediaQuery('(min-width:600px)');
    const videoList = React.useMemo<React.ReactElement>(() => (
        <VideoList {...rest} />
    ), [rest.videos, rest.active])
    if (matches) {
        return show && videoList
    }
    else {
        return (
            <SwipeableDrawer
                anchor="left"
                open={show}
                onClose={_ => onUpdateShow(false)}
                onOpen={_ => onUpdateShow(true)}
                ModalProps={{
                    keepMounted: true
                }}
            >
                <Box sx={{
                    maxWidth: 240,
                    margin: '5px'
                }}>
                    <SearchBar onSearch={onSearch} />
                </Box>
                {videoList}
            </SwipeableDrawer>
        )
    }
}

interface ResponsiveHeaderProps extends HeaderProps {
    show: boolean;
}

const ResponsiveHeader: React.FunctionComponent<ResponsiveHeaderProps> = ({ show, ...rest }) => {
    const matches = useMediaQuery('(max-width:600px)');
    if (matches) {
        return (
            <Header {...rest} />
        )
    }
    return (
        <>
            {
                show && (
                    <Header {...rest} showSearch />
                )
            }
            <Zoom in={!show}>
                <IconButton color="primary" onClick={rest.onToggleMenu} sx={{
                    position: 'absolute',
                    left: 16,
                    top: 12,
                    zIndex: 20
                }}>
                    <MenuIcon />
                </IconButton>
            </Zoom>
        </>
    )
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
