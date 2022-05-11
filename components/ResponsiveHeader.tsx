import React from 'react'
import Header from 'components/Header'
import type { HeaderProps } from 'components/Header'
import Zoom from '@mui/material/Zoom'
import { IconButton } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import useMobile from 'util/useMobile'
import {
    Menu as MenuIcon
} from '@mui/icons-material'

export interface ResponsiveHeaderProps extends HeaderProps {
    show: boolean;
}

const ResponsiveHeader: React.FunctionComponent<ResponsiveHeaderProps> = ({ show, ...rest }) => {
    const matches = useMediaQuery('(max-width:600px)')
    const isMobile = useMobile()
    if (matches) {
        return (
            <Header {...rest} />
        )
    }
    return (
        <>
            {
                show && !isMobile && (
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

export default ResponsiveHeader;
