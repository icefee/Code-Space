import React, { useState, useRef } from "react";
import Head from 'next/head';
import { BMap, BMapIns } from "../../components/packages/BMap";
import { createPoint } from '../../components/packages/BMap/lib/baidu';
import css from "./style.module.css";
import { MapConfig } from "util/config";
import { Button, Link, ToggleButtonGroup, ToggleButton, Divider, Select, MenuItem, FormControl, Input, InputAdornment, InputLabel } from "@mui/material";
import {
    HighlightAltOutlined as HighlightAltOutlinedIcon,
    SaveAltOutlined as SaveAltOutlinedIcon,
    LocationOnOutlined as LocationOnOutlinedIcon
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
    const [thread, setThread] = useState(20)

    const [locateString, setLocateString] = useState('')

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
        createTileBat([
            `${lb.lng},${lb.lat}`,
            `${rt.lng},${rt.lat}`,
            range,
            mapTypes.join(),
            `-thread=${thread}`
        ].join(' '), `tile-${tileIndex}`)
        setTileIndex(tileIndex + 1)
    }

    const handleSetTypes = (
        _event: React.MouseEvent<HTMLElement>,
        types: string[],
    ) => {
        setMapTypes(types);
    }

    const onLocate = () => {
        try {
            const locate = locateString.split(',')
            if (locate.length > 1) {
                const [lng, lat] = locate.map(Number);
                /* @ts-ignore */
                mapIns.current.centerAndZoom(createPoint(lng, lat), 15);
            }
        }
        catch(err) {
            console.warn(err)
        }
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
                <div className={css.quickLocate}>
                    <Input
                        placeholder="格式:116.4133,39.9109"
                        onChange={
                            (ev: React.ChangeEvent<HTMLInputElement>) => setLocateString(ev.target.value)
                        }
                        onKeyUp={
                            (ev: React.KeyboardEvent<HTMLInputElement>) => ev.key === 'Enter' && onLocate()
                        }
                        color="primary"
                        startAdornment={
                            <InputAdornment position="start">
                                <LocationOnOutlinedIcon />
                            </InputAdornment>
                        }
                        sx={{
                            fontSize: 13
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={onLocate}
                        sx={{ marginLeft: 1 }}>定位</Button>
                </div>
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
                            sx={{ margin: '0 var(--gap-space)' }}
                            onClick={createScript}
                            endIcon={<SaveAltOutlinedIcon />}>生成</Button>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Button sx={{ marginLeft: 1 }} size="small" component={Link} href="/bin/tile.exe">下载器</Button>
                    </div>
                    {
                        rectangel && (
                            <>
                                <Divider variant="middle" sx={{ margin: 'var(--gap-space) 0' }} flexItem />
                                <div className={css.option}>
                                    <ToggleButtonGroup
                                        value={mapTypes}
                                        onChange={handleSetTypes}
                                        color="primary"
                                        size="small"
                                    >
                                        <ToggleButton value="normal">常规</ToggleButton>
                                        <ToggleButton value="sate">卫星</ToggleButton>
                                        <ToggleButton value="mix">混合</ToggleButton>
                                    </ToggleButtonGroup>
                                    <FormControl>
                                        <InputLabel>线程</InputLabel>
                                        <Select
                                            value={thread}
                                            label="线程"
                                            size="small"
                                            onChange={event => setThread(event.target.value as number)}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default MapTile
