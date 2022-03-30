import type { FC } from "react";
import type { Point, PolylineOption } from "../lib/baidu";

export type PolylineProps = {
    points: Point[]
} & PolylineOption;
export default Polyline as FC<PolylineProps>;
