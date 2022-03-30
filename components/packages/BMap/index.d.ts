import React from 'react'
import { MapProps } from './Map'
import { MarkerProps } from './overlay/Marker'
import { InfoWindowProps } from './overlay/InfoWindow'
import { ContextMenuProps } from './ContextMenu/ContextMenu'
import { ContextMenuOptionProps } from './ContextMenu/ContextMenuOption'
import { PolylineProps } from './overlay/Polyline'
export type * from './lib/baidu'

export const BMap: React.ForwardRefExoticComponent<MapProps>;
export const Marker: React.ForwardRefExoticComponent<MarkerProps>;
export const InfoWindow: React.ForwardRefExoticComponent<InfoWindowProps>;
export const ContextMenu: React.ForwardRefExoticComponent<ContextMenuProps>;
export const ContextMenuOption: React.ForwardRefExoticComponent<ContextMenuOptionProps>;
export const Polyline: React.ForwardRefExoticComponent<PolylineProps>;