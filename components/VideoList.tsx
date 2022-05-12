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
    videos: Section[];
    onPlay: (arg: PlayingVideo) => void;
    active?: PlayingVideo;
}

export const getM3u8Uri: (url_template: string, m3u8: M3u8Video) => string = (url_template, m3u8) => {
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

    ref: React.RefObject<HTMLDivElement>

    constructor(props: VideoListProps) {
        super(props)
        this.ref = React.createRef()
    }

    private get activeM3u8Id(): string {
        return this.props.active ? this.props.active.url : ''
    }

    private getSelectedState(url_template: string, m3u8: M3u8Video): boolean {
        if (typeof m3u8 === 'string') {
            return this.activeM3u8Id === m3u8
        }
        return this.activeM3u8Id === getM3u8Uri(url_template, m3u8)
    }

    componentDidMount() {
        this.ref.current?.scrollIntoViewIfNeeded()
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
                disablePadding
                component="nav"
            >
                {
                    this.props.videos.length > 0 ? this.props.videos.map(
                        ({ section, series }, sectionIndex) => (
                            <List component="div" disablePadding subheader={
                                <ListSubheader component="div">{section}</ListSubheader>
                            } key={sectionIndex}>
                                {
                                    series.map(
                                        (video, i) => {
                                            if ('episodes' in video) {
                                                const { title, episodes, url_template, m3u8_list } = video as Episode
                                                return (
                                                    <StickyCollapsebleList
                                                        label={title}
                                                        icon={<MovieFilterOutlinedIcon />}
                                                        key={i}
                                                        defaultCollapsed={this.props.active && this.props.active.title === title}>
                                                        {
                                                            Array.from(
                                                                { length: episodes }
                                                            ).map(
                                                                (_, j) => {
                                                                    const selected = this.getSelectedState(url_template, m3u8_list[j]);
                                                                    return (
                                                                        <StyledListItemButton
                                                                            key={j}
                                                                            sx={{ pl: 4 }}
                                                                            selected={selected}
                                                                            ref={selected ? this.ref : null}
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
                                                                }
                                                            )
                                                        }
                                                    </StickyCollapsebleList>
                                                )
                                            }
                                            else if ('m3u8_url' in video) {
                                                const { title, m3u8_url } = video as Film
                                                const selected = m3u8_url === this.activeM3u8Id;
                                                return (
                                                    <StyledListItemButton
                                                        key={sectionIndex + '-' + i}
                                                        sx={{ pl: 4 }}
                                                        selected={selected}
                                                        ref={selected ? this.ref : null}
                                                        onClick={_ => this.props.onPlay({
                                                            url: m3u8_url,
                                                            title
                                                        })}
                                                    >
                                                        <ListItemIcon>
                                                            <SlideshowOutlinedIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={title} />
                                                    </StyledListItemButton>
                                                )
                                            }
                                            else {
                                                return null
                                            }
                                        }
                                    )
                                }
                            </List>
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
