import { useEffect, useContext, forwardRef, Children } from "react";
import * as map from "../lib/baidu";
// import { MapContext } from "../Map";

function ContextMenu({ children }, ref) {
    // const context = useContext(MapContext);
    useEffect(() => {
        const options = Children.toArray(children);
        const menu = map.addContextMenu(
            options.map(
                ({ props }) => props.children ? ({
                    label: props.children,
                    onClick: props.onClick,
                    width: props.width,
                    disabled: Boolean(props.disabled)
                }) : null
            ),
            (ref && ref.current) ? ref.current.marker : null
        )
        return () => {
            map.removeContextMenu(menu)
        }
    }, [children, ref])
    return null;
}

export default forwardRef(ContextMenu)
