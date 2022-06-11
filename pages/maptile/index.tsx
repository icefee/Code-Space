import React, { useState, useRef } from "react";
import Head from 'next/head';
import { BMap, BMapIns } from "../../components/packages/BMap";
import css from "./style.module.css";
import { MapConfig } from "util/config";
import { Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {
    HighlightAltOutlined as HighlightAltOutlinedIcon,
    SaveAltOutlined as SaveAltOutlinedIcon
} from '@mui/icons-material';
import { createTileBat } from 'util/tile'

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
    const mapIns = useRef<BMapIns>()
    const drawer = useRef<unknown>()
    const [rectangel, setRectangel] = useState<any>(null)
    const [tileIndex, setTileIndex] = useState(1)
    const [mapTypes, setMapTypes] = useState<string[]>(['normal', 'sate', 'mix'])

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
            drawer.current?.close()
            setRectangel(overlay);
        });
        drawer.current = drawingManager;

        mapIns.current = map;
    }

    const toggleDrawing = () => {
        if (rectangel) {
            /* @ts-ignore */
            mapIns.current?.removeOverlay(rectangel)
            /* @ts-ignore */
            drawer.current?.open();
            setRectangel(null)
        }
        else if (drawing) {
            setDrawing(false)
            /* @ts-ignore */
            drawer.current?.close()
        }
        else {
            setDrawing(true)
            /* @ts-ignore */
            drawer.current?.open();
            /* @ts-ignore */
            drawer.current?.setDrawingMode(BMAP_DRAWING_RECTANGLE)
        }
    }

    const createScript = () => {
        const bounds = rectangel.getBounds()
        let lb = bounds.getSouthWest();
        let rt = bounds.getNorthEast();
        const range = '1,19';
        createTileBat(`${lb.lng},${lb.lat} ${rt.lng},${rt.lat} ${range} ${mapTypes.join()}`, `tile-${tileIndex}`)
        setTileIndex(tileIndex + 1)
    }

    const handleSetTypes = (
        _event: React.MouseEvent<HTMLElement>,
        types: string[],
    ) => {
        setMapTypes(types);
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
                    <div className={css.operate}>
                        <Button
                            variant={rectangel ? 'contained' : 'outlined'}
                            size="small"
                            color={drawing ? 'error' : 'primary'}
                            onClick={toggleDrawing}
                            startIcon={<HighlightAltOutlinedIcon />}>
                            {rectangel ? '重绘' : (drawing ? '取消' : '绘制')}
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={!rectangel || mapTypes.length === 0}
                            style={{ marginLeft: 8 }}
                            onClick={createScript}
                            endIcon={<SaveAltOutlinedIcon />}>生成</Button>
                    </div>
                    {
                        rectangel && (
                            <ToggleButtonGroup
                                value={mapTypes}
                                onChange={handleSetTypes}
                                color="primary"
                                sx={{
                                    marginTop: 'var(--gap-space)'
                                }}
                                fullWidth
                            >
                                <ToggleButton size="small" value="normal">常规</ToggleButton>
                                <ToggleButton size="small" value="sate">卫星</ToggleButton>
                                <ToggleButton size="small" value="mix">混合</ToggleButton>
                            </ToggleButtonGroup>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default MapTile
