import React from "react";
import { AppContext } from "next/app";
import Head from "next/head";
import css from './videos.module.css'

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ThemeStorager } from 'components/PageBase'
import type { ThemeMode } from 'components/PageBase'
import Header from 'components/Header'
import { StyledListItemButton } from 'components/Menu'

import { CollapsebleList } from 'components/Menu'
import { readFileSync } from 'fs'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(
    () => import('components/VideoPlayer'),
    { ssr: false }
)

export type M3u8Video = {
    id: number;
    sign: string;
}

type Video = {
    title: string;
    episodes: number;
    m3u8_list: M3u8Video[]
}

interface VideoListProps {
    videos: Video[];
    onPlay: (arg: M3u8Video) => void;
    active?: M3u8Video;
}

class VideoList extends React.Component<VideoListProps> {

    private get activeM3u8Id(): number {
        if (this.props.active) {
            return this.props.active.id
        }
        return -1
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
                    maxWidth: 240,
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
                        ({ title, episodes, m3u8_list }, i) => (
                            <CollapsebleList label={title} icon={<MovieFilterOutlinedIcon />} key={i} defaultCollapsed>
                                <List component="div" disablePadding>
                                    {
                                        Array.from(
                                            { length: episodes }
                                        ).map(
                                            (_, j) => (
                                                <StyledListItemButton key={j} sx={{ pl: 4 }} selected={this.activeM3u8Id === m3u8_list[j].id} onClick={_ => this.props.onPlay(m3u8_list[j])}>
                                                    <ListItemIcon>
                                                        <SlideshowOutlinedIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={`第${j + 1}集`} />
                                                </StyledListItemButton>
                                            )
                                        )
                                    }
                                </List>
                            </CollapsebleList>
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
                            <Typography variant="caption" component="div">
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

export default class Videos extends React.PureComponent<{ videos: Video[]; active?: M3u8Video; showMenu: boolean; keyword: string; }> {

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
                            <Header
                                title="视频文件夹"
                                onToggleMenu={this.onToggleMenu.bind(this)}
                                onSearch={this.onSearch.bind(this)}
                                isDark={isDark}
                                onSwitchTheme={() => switchTheme(!isDark)}
                            />
                            <div className={css.videos}>
                                {
                                    this.state.showMenu && (
                                        <VideoList videos={this.searchedVideos} active={this.state.active} onPlay={active => this.setState({ active })} />
                                    )
                                }
                                <VideoPlayer playing={this.state.active} />
                            </div>
                        </div>
                    )
                }
            </ThemeStorager>
        )
    }
}
