import React from 'react'
import type { VideoListProps } from './VideoList'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import useMobile from 'util/useMobile'
import VideoList from '@components/VideoList'
import { SearchBar } from 'components/Header'

export interface ResponsiveVideoListProps extends VideoListProps {
    show: boolean;
    onUpdateShow: (arg: boolean) => void;
    onSearch: React.ChangeEventHandler<HTMLInputElement>;
}

const ResponsiveVideoList: React.FunctionComponent<ResponsiveVideoListProps> = ({ show, onUpdateShow, onSearch, ...rest }) => {
    const isMobile = useMobile();
    const videoList = React.useMemo<React.ReactElement>(() => (
        <VideoList {...rest} />
    ), [rest.videos, rest.active])
    if (isMobile) {
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
                    <SearchBar fill onSearch={onSearch} />
                </Box>
                {videoList}
            </SwipeableDrawer>
        )
    }
    else {
        return show && videoList
    }
}

export default ResponsiveVideoList
