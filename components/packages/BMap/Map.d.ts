import type { FC, ReactElement, ReactNode } from "react";
import type { BMapIns, Point } from "./lib/baidu";
export type MapProps = {
    ak: string;
    center: Point;
    zoom: number;
    children?: ReactNode;
    onClick?(point: Point): void;
    onReady?(map: BMapIns): void;
    // ref?: MutableRefObject<BMapIns>;
};
export default Map as FC<MapProps>;