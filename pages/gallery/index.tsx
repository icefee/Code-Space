import React, { useState, useMemo, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Paper, Dialog, AppBar, Toolbar, IconButton, Slide, ButtonBase, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { TransitionProps } from '@mui/material/transitions';
import css from './style.module.css'

const ImageViewer = dynamic(
    () => import('components/ImageViewer'),
    { ssr: false }
)

const ImageItem: React.FunctionComponent<{ src: string }> = ({ src }) => {

    const [url, setUrl] = useState('')
    const [imageStyle, setImageStyle] = useState({})
    const wrapRef = useRef<HTMLDivElement>()
    
    useEffect(() => {
        const image = new Image();
        image.src = src;
        const containerWidth = wrapRef.current!.clientWidth;
        image.onload = () => {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            const width = Math.max(aspectRatio * 300, containerWidth);
            setImageStyle({
                width,
                height: width / aspectRatio,
            })
            setUrl(src)
        }
    }, [])

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 300,
            overflow: 'hidden'
        }} ref={wrapRef}>
            <img className={css.fitImage} style={imageStyle} src={url} />
        </div>
    )
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Gallery() {
    const [images, setImages] = useState<string[]>([])
    const [activeImage, setActiveImage] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const pageSize = 20;

    const fetchData = async () => {
        const images = await fetch('./gallery/ptumeng.json').then<string[]>(response => response.json())
        setImages(images);
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderImages = useMemo(() => {
        return images.slice(0, pageSize * page)
    }, [images, page])

    const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
        const element = event.target as HTMLDivElement; // // if (document.documentElement.scrollHeight == this.innerHeight + this.scrollY)
        if (element.clientHeight + element.scrollTop + 40 >= element.scrollHeight && page * pageSize < images.length) {
            setPage(page => page + 1)
        }
    }

    return (
        <>
            <Head>
                <title>相册文件夹</title>
                <meta name="referrer" content="no-referrer" />
            </Head>
            <div className={css.container} onScroll={handleScroll}>
                {
                    renderImages.map(
                        (url, index) => (
                            <div className={css.imageWrap} key={index}>
                                <Paper elevation={3} square>
                                    <ButtonBase sx={{
                                        width: '100%',
                                    }} onClick={() => setActiveImage(url)}>
                                        <ImageItem src={url} />
                                    </ButtonBase>
                                </Paper>
                            </div>
                        )
                    )
                }
            </div>
            <Dialog
                fullScreen
                open={Boolean(activeImage)}
                TransitionComponent={Transition}
            >
                <AppBar color="transparent" sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setActiveImage(null)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">预览</Typography>
                    </Toolbar>
                </AppBar>
                <div className={css.imageView}>
                    <img className={css.image} src={activeImage} />
                </div>
            </Dialog>
            {/* <div style={{
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ImageViewer images={images} />
            </div> */}
        </>
    )
}
