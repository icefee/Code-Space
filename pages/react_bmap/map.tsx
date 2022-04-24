import React, { useState } from "react";
import DocBase from "@components/DocBase";
import PageBase, { PageProps } from "@components/PageBase";
import { BMap, Marker, InfoWindow, ContextMenu, ContextMenuOption, Polyline } from "../../components/packages/BMap";
import type { Point } from "../../components/packages/BMap";
import { loadCode } from "../../util/code";
import type { AppContext } from "next/app";
import css from "./map.module.css";
import Link from "next/link";
import { MapConfig } from "util/config";

const MapDemo: React.FC = () => {

    const [mapClick, setMapClick] = useState(false)
    const [markers, setMarkers] = useState<Array<Point & { id: number }>>([])

    const handleMapClick = (point: Point) => {
        setMarkers(markers => [...markers, { ...point, id: Date.now() }])
    }

    const _handleDragging = ({ point }: { point: Point }, id: number) => {
        setMarkers(
            markers => markers.map(m => m.id === id ? ({ ...m, ...point }) : m)
        )
    }

    const _removeMarker = (id: number) => {
        setMarkers(
            markers => markers.filter(m => m.id !== id)
        )
    }

    const _handleClickMenuItem = (name: string) => {
        console.log(`${name} clicked.`)
    }

    return (
        <div className={css.container}>
            <BMap
                center={{ lng: 116.413387, lat: 39.910924 }}
                zoom={12}
                ak={MapConfig.ak}
                onClick={mapClick ? handleMapClick : undefined}
            >
                {
                    markers.map(
                        ({ id, ...point }) => (
                            <InfoWindow key={id} width={220} title="标题" content={`lng: ${point.lng}, lat: ${point.lat}`}>
                                <Marker dragable onDragging={ev => _handleDragging(ev, id)} point={point}>
                                    <ContextMenu>
                                        <ContextMenuOption width={120} onClick={() => _handleClickMenuItem('选项一')} disabled>选项一</ContextMenuOption>
                                        <ContextMenuOption />
                                        <ContextMenuOption width={120} onClick={() => _removeMarker(id)}>删除</ContextMenuOption>
                                    </ContextMenu>
                                </Marker>
                            </InfoWindow>
                        )
                    )
                }
                <Polyline points={markers} strokeColor="green" />
                <Marker dragable={mapClick} point={{ lng: 116.413387, lat: 39.910924 }} />
            </BMap>
            <button onClick={() => setMapClick(!mapClick)}>{mapClick ? '可编辑' : '锁定'}</button>
        </div>
    )
}

class ReactBMap extends PageBase<{ code: string }> {
    protected childRender(props: PageProps) {
        return (
            <DocBase
                demo={
                    <BMap
                        center={{ lng: 116.413387, lat: 39.910924 }}
                        zoom={12}
                        ak={MapConfig.ak}
                    />
                }
                code={this.props.code}
                api={
                    [
                        {
                            name: 'ak',
                            type: 'string',
                            description: '官网申请的ak'
                        },
                        {
                            name: 'center',
                            type: <Link href="/react_bmap/type#Point">Point</Link>,
                            description: '地图的初始中心点'
                        },
                        {
                            name: 'zoom',
                            type: 'numer',
                            description: '地图初始化的缩放'
                        },
                        {
                            name: 'onClick',
                            type: '(arg: Point) => void | undefined',
                            description: '点击地图的回调'
                        }
                    ]
                }
            />
        )
    }
}

export async function getStaticProps(context: AppContext) {
    const code = loadCode('map');
    return {
        props: {
            code
        }
    }
}

export default ReactBMap;
