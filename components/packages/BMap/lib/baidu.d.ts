declare type BMapIns = {
    getCenter(): Point;
    getZoom(): number;
};
declare type MarkerIns = {
    id?: number;
    enableDragging: () => void;
    disableDragging: () => void;
    getPosition: () => Point;
};
declare type InfoWindowOption = {
    title?: string;
    content: string;
    width?: number;
    height?: number;
};
declare type InfoWindowIns = {
    setWidth(pixel: number): void;
    setHeight(pixel: number): void;
    setTitle(title: string | HTMLElement): void;
    getContent(title: string | HTMLElement): void;
    redraw(): void;
};
declare type Label = any;
declare var map: BMapIns;
declare type Option = {
    lng: number;
    lat: number;
    zoom: number;
};
declare type Point = {
    lng: number;
    lat: number;
};
declare type PolylineIns = {
    setPath(points: Point[]): void
};
export type PolylineOption = {
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
    strokeStyle?: 'solid' | 'dashed';
};
declare type MapMouseEvent<T> = {
    type: string;
    pixel: {
        x: number;
        y: number;
    },
    point: Point,
    target: T
};
declare type ContextMenuIns = any;
declare type ContextMenuOption = {
    width: number;
    label: string;
    onClick?(): void
};
type ContextMenuElement = BMapIns | MarkerIns | PolylineIns;
export function getMap(): BMapIns;
export function init(id: string, option: Option): Promise<BMapIns>;
export function setPosition(option: Option): void;
export function setMapStyle(style: any): void;
export function locationsToPoints(points: Point[]): any[];
export function bindEvent(ev: string, target: unknown, callback: (ev: any) => void): void;
export function removeEvent(ev: string, target: unknown, callback: (ev: any) => void): void;
export function createPileMarker(lng: number, lat: number, label?: string): MarkerIns;
export function removeOverlay(overlay: MarkerIns | PolylineIns): void;
export function setLabel(marker: MarkerIns, content: string): Label;
export function getDistance(start: Point, end: Point): number;
export function createPolyline(points: Point[], option?: PolylineOption): PolylineIns;
export function createPoint(lng: number, lat: number): Point;
export function createInfoWindow(option: InfoWindowOption): InfoWindowIns;
export function addContextMenu(menus: ContextMenuOption[], target: ContextMenuElement): ContextMenuIns;
export function removeContextMenu(menu: ContextMenuIns, target: ContextMenuElement): void;
