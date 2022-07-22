import React from 'react'
import { Backdrop, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material'
import {
    EjectOutlined as EjectOutlinedIcon,
    CloseOutlined as CloseOutlinedIcon,
    SkipPrevious as SkipPreviousIcon,
    SkipNext as SkipNextIcon,
    FastRewind as FastRewindIcon,
    FastForward as FastForwardIcon
} from '@mui/icons-material'

interface QuickActionProps {
    hidden?: boolean;
    first?: boolean;
    last?: boolean;
    onAction?: (key: string) => boolean | void;
}

const QuickAction: React.FunctionComponent<QuickActionProps> = (props = { hidden: false, first: false, last: false }) => {
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleAction = (key: string) => () => {
        const close = props.onAction?.(key)
        if (close) {
            handleClose()
        }
    }
    return (
        <>
            <Backdrop sx={{ zIndex: 2 }} open={open} />
            <SpeedDial
                ariaLabel="快捷操作"
                sx={{ position: 'absolute', bottom: 60, right: 16 }}
                icon={<SpeedDialIcon icon={<EjectOutlinedIcon />} openIcon={<CloseOutlinedIcon />} />}
                hidden={props.hidden}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                FabProps={{ size: 'medium' }}
            >
                <SpeedDialAction
                    icon={<FastRewindIcon />}
                    tooltipTitle="快退15秒"
                    tooltipOpen
                    onClick={handleAction('rewind')}
                />
                <SpeedDialAction
                    icon={<FastForwardIcon />}
                    tooltipTitle="快进15秒"
                    tooltipOpen
                    onClick={handleAction('forward')}
                />
                {
                    !props.last && (
                        <SpeedDialAction
                            icon={<SkipNextIcon />}
                            tooltipTitle="下一集"
                            tooltipOpen
                            onClick={handleAction('next')}
                        />
                    )
                }
                {
                    !props.first && (
                        <SpeedDialAction
                            icon={<SkipPreviousIcon />}
                            tooltipTitle="上一集"
                            tooltipOpen
                            onClick={handleAction('prev')}
                        />
                    )
                }
            </SpeedDial>
        </>
    )
}

export default QuickAction
