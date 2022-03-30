import type { FC, ReactNode, EventHandler } from "react";
export type ContextMenuOptionProps = {
    width?: number;
    children?: string;
    disabled?: boolean;
    onClick?: EventHandler
};

export default ContextMenuOption as FC<ContextMenuOptionProps>;
