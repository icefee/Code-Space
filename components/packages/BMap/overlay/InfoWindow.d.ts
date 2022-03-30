import type { FC, ReactElement } from "react";

export type InfoWindowProps = {
    title?: string;
    content?: string;
    width: number;
    height?: number;
    children?: ReactElement;
    defaultShow?: boolean;
};

export default InfoWindow as FC<InfoWindowProps>;
