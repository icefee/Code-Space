import React, { useMemo, useState, useEffect } from "react";
import Head from 'next/head'
import Header from './Header'
import Menu from './Menu'
import type { MenuOption } from "./Menu";
import { ThemeProvider, createTheme, useTheme, styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import css from './PageBase.module.css'
import { useLocalStorage } from "react-use";
import {
    StarBorder as StarBorderIcon,
    LibraryAddCheckOutlined as LibraryAddCheckOutlinedIcon,
    DashboardCustomize as DashboardCustomizeIcon,
    Map as MapIcon
} from '@mui/icons-material';
import { SnackbarProvider } from "../util/useSnackbar";

export interface PageProps {
    title: string;
    keywords?: string;
    description?: string;
}

export interface PageState {
    showMenu: boolean;
}

type ThemeMode = {
    isDark: boolean;
    switchTheme?(arg: boolean): void;
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export interface ThemeStoragerProps {
    children(arg: ThemeMode): React.ReactNode
}

const useDark: <T, >(arg: T) => [T, React.Dispatch<T>] = <T,>(initValue: T) => {
    const [isDark, setDark] = useState<T>(initValue);
    const [storage, setStorage] = useLocalStorage<T>('__dark_theme', initValue);
    useEffect(() => {
        setDark(storage)
    }, [storage])
    return [isDark, setStorage]
}

const ThemeStorager: React.FC = ({ children }: ThemeStoragerProps) => {
    const theme = useTheme<Theme>();
    const [isDark, switchTheme] = useDark<boolean>(false);
    const displayTheme = useMemo<Theme>(() => {
        if (isDark) {
            return darkTheme
        }
        return theme;
    }, [isDark, theme])
    return (
        <ThemeProvider theme={displayTheme}>
            {children({ isDark, switchTheme })}
        </ThemeProvider>
    )
}

const menuItems: MenuOption[] = [
    {
        label: '介绍',
        href: '/',
        icon: <DashboardCustomizeIcon />
    },
    {
        label: 'React-BMap',
        icon: <MapIcon />,
        children: [
            {
                label: 'Map 地图',
                href: '/react_bmap/map',
                icon: <StarBorderIcon />
            },
            {
                label: '类型参考',
                href: '/react_bmap/type',
                icon: <LibraryAddCheckOutlinedIcon />
            }
        ]
    }
];

const ThemedDiv = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#eee'
}))

class PageBase<T = any> extends React.PureComponent<PageProps & T, PageState> {

    public state: Readonly<PageState> = {
        showMenu: true
    };

    protected childRender(props: PageProps) {
        return null;
    }

    private onToggleMenu() {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    public render() {

        const { title, keywords, description } = this.props;

        return (
            <SnackbarProvider>
                <ThemeStorager>
                    {
                        ({ isDark, switchTheme }: ThemeMode) => (
                            <div className={css.container}>
                                <Head>
                                    <title>{title}</title>
                                    <link rel="icon" href="/favicon.ico" />
                                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                                    <meta name="keywords" content={keywords} />
                                    <meta name="description" content={description} />
                                </Head>
                                <Header onToggleMenu={this.onToggleMenu.bind(this)} isDark={isDark} onSwitchTheme={() => switchTheme(!isDark)} />
                                <div className={css.child}>
                                    {this.state.showMenu && <Menu items={menuItems} />}
                                    <ThemedDiv className={css.childView}>
                                        {this.childRender(this.props)}
                                    </ThemedDiv>
                                </div>
                            </div>
                        )
                    }
                </ThemeStorager>
            </SnackbarProvider>
        )
    }
}

export default PageBase;
