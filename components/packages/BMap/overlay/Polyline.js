import { useEffect } from "react";
import * as map from "../lib/baidu";

function Polyline({ points, ...option }) {
    useEffect(() => {
        const polyline = map.createPolyline(points, option);
        return () => {
            map.removeOverlay(polyline);
        }
    }, [points])
    return null;
}

export default Polyline;
