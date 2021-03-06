import React, { useState } from 'react'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import type { ListItemButtonBaseProps, ListItemButtonTypeMap } from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import {
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import RefContext from './RefContext'
import { OverrideProps } from '@mui/material/OverridableComponent'

const ForwardRefListItemButton = React.forwardRef<HTMLDivElement, ListItemButtonBaseProps & OverrideProps<ListItemButtonTypeMap, "div">>((props, ref) => (
    <ListItemButton {...props} ref={ref} />
))

export const StyledListItemButton = styled(ForwardRefListItemButton)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
}))

export interface ListLinkButtonProps extends ListItemButtonBaseProps {
    href: string;
    children: React.ReactNode;
}

const ListLinkButton: React.FC<ListLinkButtonProps> = ({ href, children, ...rest }) => {
    const router = useRouter();
    return (
        <RefContext.Consumer>
            {
                ref => (
                    <StyledListItemButton ref={ref} selected={router.route === href} onClick={() => router.push(href)} {...rest}>
                        {children}
                    </StyledListItemButton>
                )
            }
        </RefContext.Consumer>
    )
}

export interface CollapsebleListProps {
    label: string;
    icon: React.ReactElement;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
}

const ToggleExpandIcon: React.FC<{ collapsed: boolean; }> = ({ collapsed }) => collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />

export const CollapsebleList: React.FC<CollapsebleListProps> = ({ label, icon, children, defaultCollapsed = false }) => {
    const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
    return (
        <>
            <StyledListItemButton onClick={() => setCollapsed(!collapsed)}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
                <ToggleExpandIcon collapsed={collapsed} />
            </StyledListItemButton>
            <Collapse in={collapsed} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    )
}

export const StickyCollapsebleList: React.FC<CollapsebleListProps> = ({ label, icon, children, defaultCollapsed = false }) => {
    const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
    return (
        <List subheader={
            <ListSubheader component="div" disableGutters>
                <StyledListItemButton onClick={() => setCollapsed(!collapsed)}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={label} />
                    <ToggleExpandIcon collapsed={collapsed} />
                </StyledListItemButton>
            </ListSubheader>
        } disablePadding>
            <Collapse in={collapsed} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </List>
    )
}

export interface MenuOption {
    label: string;
    href?: string;
    icon: React.ReactElement;
    children?: MenuOption[];
}

const NestedList: React.FC<{ menu: MenuOption } & ListItemButtonBaseProps> = ({ menu, ...rest }) => {
    if (menu.children) {
        return (
            <CollapsebleList label={menu.label} icon={menu.icon} defaultCollapsed>
                <List component="div" disablePadding>
                    {
                        menu.children.map(
                            (child, index) => <NestedList key={index} menu={child} sx={{ pl: 4 }} />
                        )
                    }
                </List>
            </CollapsebleList>
        )
    }
    return (
        <ListLinkButton href={menu.href} {...rest}>
            <ListItemIcon>
                {menu.icon}
            </ListItemIcon>
            <ListItemText primary={menu.label} />
        </ListLinkButton>
    )
}

const Menu: React.FC<{ items: MenuOption[] }> = ({ items }) => {
    return (
        <List
            sx={{ width: '100%', maxWidth: 240, bgcolor: 'background.paper', overflowY: 'auto' }}
            component="nav"
            subheader={
                <ListSubheader component="div">????????????</ListSubheader>
            }
        >
            {
                items.map(
                    (menu, index) => <NestedList key={index} menu={menu} />
                )
            }
        </List>
    );
}

export default Menu;
