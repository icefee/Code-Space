import React, { useState, useRef } from "react";
import Head from 'next/head';
import { BMap, BMapIns } from "../../components/packages/BMap";
import css from "./style.module.css";
import { MapConfig } from "util/config";
import { Button } from "@mui/material";
import {
    HighlightAltOutlined as HighlightAltOutlinedIcon,
    SaveAltOutlined as SaveAltOutlinedIcon
} from '@mui/icons-material';

const loadDrawTool = () => {
    return new Promise(
        resolve => {
            const script = document.createElement('script');
            script.src = '/map/DrawingManager.min.js';
            script.defer = true;
            script.onload = resolve
            document.head.appendChild(script)
        }
    )
}

const MapTile: React.FC = () => {

    const [drawing, setDrawing] = useState(false)
    const drawer = useRef<unknown>()

    const onMapCreated = async (map: BMapIns) => {
        await loadDrawTool()

        /* @ts-ignore */
        var drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false,
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
                anchor: 1, //位置/偏离值
                drawingModes: [
                    /* @ts-ignore */
                    'rectangle',
                ],
                scale: .8
            },
            rectangleOptions: {
                strokeColor: 'purple',    //边线颜色。
                fillColor: 'purple',      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 2,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            } //矩形的样式
        });
        drawingManager.addEventListener("rectanglecomplete", (overlay: unknown) => {
            /* @ts-ignore */
            console.log(overlay.getBounds());
        });
        drawingManager.addEventListener("rectanglecomplete", (overlay: unknown) => {
            /* @ts-ignore */
            console.log(overlay.getBounds());
        });
        drawer.current = drawingManager;
    }

    const toggleDrawing = () => {
        console.log(drawer.current)
        if (drawing) {
            /* @ts-ignore */
            drawer.current?.close()
        }
        else {
            /* @ts-ignore */
            drawer.current?.open();
            /* @ts-ignore */
            drawer.current?.setDrawingMode(BMAP_DRAWING_RECTANGLE)
        }
        setDrawing(!drawing)
    }

    return (
        <>
            <Head>
                <title>地图贴图下载</title>
                <link rel="stylesheet" href="/map/DrawingManager.min.css" />
            </Head>
            <div className={css.container}>
                <BMap
                    center={{ lng: 116.413387, lat: 39.910924 }}
                    zoom={12}
                    ak={MapConfig.ak}
                    onReady={onMapCreated}
                />
                <div className={css.drawTool}>
                    <Button variant="contained" color={drawing ? 'success' : 'primary'} onClick={toggleDrawing} startIcon={<HighlightAltOutlinedIcon />}>绘制</Button>
                    <Button variant="contained" style={{marginLeft: 8}} endIcon={<SaveAltOutlinedIcon />}>生成</Button>
                </div>
            </div>
        </>
    )
}

export default MapTile
