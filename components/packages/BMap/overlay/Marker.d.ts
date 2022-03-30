import type { FC, ReactNode } from "react";
import type { Point, MarkerIns, MapMouseEvent } from "../lib/baidu";

export type MarkerProps = {
    point: Point;
    label?: string;
    dragable?: boolean;
    onClick?(ev: MouseEvent): void;
    onDragging?(ev: MapMouseEvent<MarkerIns>): void;
    onDragStart?(ev: MapMouseEvent<MarkerIns>): void;
    onDragEnd?(ev: MapMouseEvent<MarkerIns>): void;
    eventStopPropagation?: boolean; /// stopPropagation on target
    children?: ReactNode
};
export default Marker as FC<MarkerProps>;
