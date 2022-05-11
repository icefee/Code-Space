import React from "react"
import { isBrowser } from './env'

function useMobile() {
    const [isMobile] = React.useState(
        () => {
            if (!isBrowser) {
                return false
            }
            return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
        }
    )
    return isMobile
}

export default useMobile;
