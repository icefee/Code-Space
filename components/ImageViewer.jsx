import { useRef } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import styles from './ImageViewer.module.css'

export default function ImageViewer({ images }) {
    const index = useRef(0)
    const width = window.innerWidth

    const [props, api] = useSprings(images.length, i => ({
        x: i * width,
        scale: 1,
        display: 'block',
    }))
    const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
        if (active && Math.abs(mx) > width / 2) {
            index.current = Math.min(Math.max(0, index.current + (xDir > 0 ? -1 : 1)), images.length - 1) // clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)
            cancel()
        }
        api.start(i => {
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
            const x = (i - index.current) * width + (active ? mx : 0)
            const scale = active ? 1 - Math.abs(mx) / width / 2 : 1
            return { x, scale, display: 'block' }
        })
    })
    return (
        <div className={styles.wrapper}>
            {props.map(({ x, display, scale }, i) => (
                <animated.div className={styles.page} {...bind()} key={i} style={{ display, x }}>
                    <animated.div style={{
                        scale,
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        overflow: 'hidden',
                    }}>
                        <img src={images[i]} onDragStart={
                            ev=> ev.preventDefault()
                        } style={{
                            display: 'block',
                            userSelect: 'none',
                            '-webkit-user-drag': 'none'
                        }} />
                    </animated.div>
                </animated.div>
            ))}
        </div>
    )
}