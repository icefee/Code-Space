import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { MapContext } from "../Map";
import * as map from '../lib/baidu';

export default function InfoWindow({ title, defaultShow = true, content, width, height, children }) {
    const { type: Children, props } = children;
    const [infoWindow, setInfoWindow] = useState(null)
    const mapIns = useContext(MapContext);
    const ref = useRef();

    useEffect(() => {
        setInfoWindow(map.createInfoWindow({
            title,
            content,
            width,
            height
        }))
        return () => {
            mapIns.closeInfoWindow();
        }
    }, [])

    useEffect(() => {
        if (infoWindow) {
            infoWindow.setWidth(width);
            infoWindow.setHeight(height);
            infoWindow.setTitle(title);
            infoWindow.setContent(content);
            infoWindow.redraw();
        }
    }, [infoWindow, title, content, width, height])

    const point = useMemo(() => {
        const { lng, lat } = props.point;
        return map.createPoint(lng, lat);
    }, [props.point])

    useEffect(() => {
        if (infoWindow) {
            if (defaultShow) {
                mapIns.openInfoWindow(infoWindow, point);
            }
            else {
                mapIns.closeInfoWindow();
            }
        }
    }, [infoWindow, defaultShow])

    const _showInfoWindow = (ev) => {
        mapIns.openInfoWindow(infoWindow, ref.current.marker.point);
    }

    useEffect(() => {
        if (infoWindow) {
            mapIns.closeInfoWindow();
            // mapIns.openInfoWindow(infoWindow, point);
        }
    }, [infoWindow, point])

    useEffect(() => {
        var marker;
        if (ref.current && ref.current.marker) {
            marker = ref.current.marker;
            map.bindEvent('click', marker, _showInfoWindow)
        }
        return () => {
            if (marker) {
                map.removeEvent('click', marker, _showInfoWindow)
            }
        }
    }, [ref.current])

    return (
        <Children ref={ref} {...props} />
    )
}
