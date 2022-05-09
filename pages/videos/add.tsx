import React from "react"
import Head from "next/head"
import type { AppContext } from "next/app"
import { Button } from "@mui/material"

import { readFileSync } from "fs"
import type { Video } from '.'

type AddVideoProps = {
    videos: Video[];
}

class AddVideo extends React.PureComponent<AddVideoProps> {
    /**
     * render
 : JSX.Element    */
    public render(): JSX.Element {
        return (
            <>
                <Head>
                    <title>添加视频</title>
                </Head>
                <Button variant="text">更新</Button>
            </>
        )
    }
}

export async function getStaticProps(context: AppContext) {
    const data = readFileSync('data/videos/list.json', { encoding: 'utf-8' })
    const parsedData = JSON.parse(data) as { videos: Video[] };
    return {
        props: {
            videos: parsedData.videos
        }
    }
}

export default AddVideo
