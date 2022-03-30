import { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import * as map from '../lib/baidu';

function Marker({ point, label = '', dragable, onClick, eventStopPropagation, onDragStart, onDragging, onDragEnd, children }, ref) {
    const [marker, setMarker] = useState(null);
    useEffect(() => {
        const { lng, lat } = point;
        setMarker(map.createPileMarker(lng, lat, label))
    }, [])

    const handleClick = useCallback(ev => {
        if (eventStopPropagation) {
            ev.domEvent.stopPropagation();
        }
        onClick && onClick(ev)
    }, [])

    const handleDragStart = useCallback(ev => {
        onDragStart && onDragStart(ev)
    }, [])

    const handleDragging = useCallback(ev => {
        onDragging && onDragging(ev)
    }, [])

    const handleDragEnd = useCallback(ev => {
        onDragEnd && onDragEnd(ev)
    }, [])

    useEffect(() => {
        if (!marker) {
            return;
        }
        if (dragable) {
            marker.enableDragging();
        }
        else {
            marker.disableDragging();
        }
    }, [marker, dragable])

    useImperativeHandle(ref, () => ({
        marker
    }), [marker])

    useEffect(() => {

        if (!marker) {
            return;
        }
        map.bindEvent('click', marker, handleClick);
        map.bindEvent('dragstart', marker, handleDragStart);
        map.bindEvent('dragging', marker, handleDragging);
        map.bindEvent('dragend', marker, handleDragEnd);

        return () => {
            map.removeEvent('click', marker, handleClick);
            map.removeEvent('dragstart', marker, handleDragStart);
            map.removeEvent('dragging', marker, handleDragging);
            map.removeEvent('dragend', marker, handleDragEnd);
            map.removeOverlay(marker);
        }
    }, [marker])

    const renderChildren = useMemo(() => {
        if (children) {
            const { type: Children, props } = children;
            return <Children ref={ref} {...props} />
        }
        return null;
    }, [children, ref])

    return renderChildren;
}

export default forwardRef(Marker);
