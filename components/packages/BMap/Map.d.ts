import type { FC, ReactElement, ReactNode } from "react";
import type { Point } from "./lib/baidu";
export type MapProps = {
    ak: string;
    center: Point;
    zoom: number;
    children?: ReactNode;
    onClick?(point: Point): void;
};
export default Map as FC<MapProps>;