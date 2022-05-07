import React from "react";
import { AppContext } from "next/app";
import Head from "next/head";
import css from './videos.module.css'

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';

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
                sx={{ width: '100%', height: '100%', overflowY: 'auto', maxWidth: 240, bgcolor: 'background.paper' }}
                component="nav"
                subheader={
                    <ListSubheader component="div">视频文件夹</ListSubheader>
                }
            >
                {
                    this.props.videos.map(
                        ({ title, episodes, m3u8_list }, i) => (
                            <CollapsebleList label={title} icon={<MovieFilterOutlinedIcon />} key={i} defaultCollapsed>
                                <List component="div" disablePadding>
                                    {
                                        Array.from(
                                            { length: episodes }
                                        ).map(
                                            (_, j) => (
                                                <ListItemButton key={j} sx={{ pl: 4 }} selected={this.activeM3u8Id === m3u8_list[j].id} onClick={_ => this.props.onPlay(m3u8_list[j])}>
                                                    <ListItemIcon>
                                                        <SlideshowOutlinedIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={`第${j + 1}集`} />
                                                </ListItemButton>
                                            )
                                        )
                                    }
                                </List>
                            </CollapsebleList>
                        )
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

export default class Videos extends React.PureComponent<{ videos: Video[], active?: M3u8Video }> {

    state = {
        active: undefined
    }

    public render(): JSX.Element {
        return (
            <>
                <Head>
                    <title>视频文件夹</title>
                    <script src="/hls.min.js"></script>
                </Head>
                <div className={css.videos}>
                    <VideoList videos={this.props.videos} active={this.state.active} onPlay={active => this.setState({ active })} />
                    <VideoPlayer playing={this.state.active} />
                </div>
            </>
        )
    }
}
