import React from 'react'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {
    MovieFilterOutlined as MovieFilterOutlinedIcon,
    SlideshowOutlined as SlideshowOutlinedIcon
} from '@mui/icons-material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { StyledListItemButton, StickyCollapsebleList } from 'components/Menu'

export interface VideoListProps {
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

export default VideoList
