import React from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Map from '@mui/icons-material/Map';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
}))

const ListLinkButton = ({ href, children, ...rest }) => {
    const router = useRouter();
    return (
        <StyledListItemButton selected={ router.asPath === href } onClick={() => router.push(href)} { ...rest }>
            {children}
        </StyledListItemButton>
    )
}

export default function NestedList() {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List
            sx={{ width: '100%', maxWidth: 320, bgcolor: 'background.paper' }}
            component="nav"
            subheader={
                <ListSubheader component="div">组件列表</ListSubheader>
            }
        >
            <StyledListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <Map />
                </ListItemIcon>
                <ListItemText primary="百度地图 React-BMap" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListLinkButton sx={{ pl: 4 }} href="/react_bmap">
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Map 地图" />
                    </ListLinkButton>
                </List>
            </Collapse>
        </List>
    );
}
