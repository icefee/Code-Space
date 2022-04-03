import React, { useState } from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import type { ListItemButtonBaseProps } from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
}))

export interface ListLinkButtonProps extends ListItemButtonBaseProps {
    href: string;
    children: React.ReactNode;
}

const ListLinkButton: React.FC<ListLinkButtonProps> = ({ href, children, ...rest }) => {
    const router = useRouter();
    return (
        <StyledListItemButton selected={router.route === href} onClick={() => router.push(href)} {...rest}>
            {children}
        </StyledListItemButton>
    )
}

export interface CollapsebleListProps {
    label: string;
    icon: React.ReactElement;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
}

const CollapsebleList: React.FC<CollapsebleListProps> = ({ label, icon, children, defaultCollapsed = false }) => {
    const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
    return (
        <>
            <StyledListItemButton onClick={() => setCollapsed(!collapsed)}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
                {collapsed ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
            <Collapse in={collapsed} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
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
            sx={{ width: '100%', maxWidth: 240, bgcolor: 'background.paper' }}
            component="nav"
            subheader={
                <ListSubheader component="div">组件列表</ListSubheader>
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
