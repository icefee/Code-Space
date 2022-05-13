import React from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Brightness2 as Brightness2Icon,
    Brightness5 as Brightness5Icon
} from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        // marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export function SearchBar({ onSearch, fill = false }: { onSearch: React.ChangeEventHandler<HTMLInputElement>, fill?: boolean }) {
    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                sx={{ width: fill ? '100%' : 'inherit' }}
                placeholder="搜索…"
                onChange={onSearch}
                inputProps={{ 'aria-label': 'search' }}
            />
        </Search>
    )
}

export type HeaderProps = {
    title: string;
    onToggleMenu: React.MouseEventHandler<HTMLButtonElement>;
    showSearch?: boolean;
    onSearch?: React.ChangeEventHandler<HTMLInputElement>;
    isDark: boolean;
    onSwitchTheme: React.MouseEventHandler<HTMLButtonElement>;
    extendButtons?: React.ReactNode;
}

export default function Header({ title, onToggleMenu, showSearch = true, onSearch, isDark, onSwitchTheme, extendButtons }: HeaderProps) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                        onClick={onToggleMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: showSearch ? 'none' : 'block', sm: 'block' } }}
                    >
                        {title}
                    </Typography>
                    {
                        showSearch && (
                            <SearchBar onSearch={onSearch} />
                        )
                    }
                    <Box>
                        <IconButton
                            size="large"
                            aria-label="switch theme"
                            onClick={onSwitchTheme}
                            color="inherit"
                        >
                            {
                                isDark ? <Brightness2Icon /> : <Brightness5Icon />
                            }
                        </IconButton>
                    </Box>
                    {extendButtons}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
