import React, { useMemo, useEffect, createContext, useState } from "react";
import css from './Map.module.css';
import * as map from './lib/baidu';

export const MapContext = createContext(null)

const useSafeMapId = () => {
    const [id, setId] = useState(null)
    useEffect(() => {
        setId('map-' + Date.now())
    }, [])
    return id
}

export default function Map({ ak, center, zoom, onClick, children }) {

    const [mapIns, setMapIns] = useState(null)
    const mapId = useSafeMapId();

    const initMap = async id => {
        setMapIns(await map.init(id, {
            ak,
            ...center,
            zoom
        }))
    }

    useEffect(() => {
        if (mapId) {
            initMap(mapId)
        }
    }, [mapId])

    const mapClick = ({ point }) => {
        onClick && onClick(point)
    }

    useEffect(() => {
        if (mapIns) {
            map[mapClick ? 'bindEvent' : 'removeEvent']('click', null, mapClick)
        }
        return () => {
            if (mapIns) {
                map.removeEvent('click', null, mapClick)
            }
        }
    }, [mapIns, mapClick])

    return (
        <MapContext.Provider value={mapIns}>
            <div className={css.map} id={mapId} />
            { mapIns && children }
        </MapContext.Provider>
    )
}
