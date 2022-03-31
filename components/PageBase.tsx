import React from "react";
import Head from 'next/head'
import Header from './Header'
import Menu from './Menu'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import css from './PageBase.module.css'

export interface PageProps {
    title: string;
    keywords?: string;
    description?: string;
}

export interface PageState {
    theme: Theme;
    showMenu: boolean;
}

const lightTheme = createTheme();
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

class PageBase extends React.PureComponent<PageProps, PageState> {

    public state: Readonly<PageState> = {
        theme: darkTheme,
        showMenu: true
    };

    protected childRender(props: PageProps) {
        return null;
    }

    private get isDark() {
        return this.state.theme.palette.mode === 'dark'
    }

    private onSwitchTheme() {
        this.setState({
            theme: this.isDark ? lightTheme : darkTheme
        })
    }

    private onToggleMenu() {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    public render() {

        const { title, keywords, description } = this.props;

        return (
            <ThemeProvider theme={this.state.theme}>
                <div className={css.container}>
                    <Head>
                        <title>{title}</title>
                        <link rel="icon" href="/favicon.ico" />
                        <meta name="viewport" content="initial-scale=1, width=device-width" />
                        <meta name="keywords" content={keywords} />
                        <meta name="description" content={description} />
                    </Head>
                    <Header onToggleMenu={this.onToggleMenu.bind(this)} isDark={this.isDark} onSwitchTheme={this.onSwitchTheme.bind(this)} />
                    <div className={css.child}>
                        { this.state.showMenu && <Menu /> }
                        <div className={css.childView}>
                            {this.childRender(this.props)}
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

export default PageBase;
