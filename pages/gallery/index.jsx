import { readFileSync } from 'fs'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const ImageViewer = dynamic(
    () => import('components/ImageViewer'),
    { ssr: false }
)

export async function getStaticProps() {
    const data = readFileSync('data/gallery/ptumeng.json', { encoding: 'utf-8' })
    const parsedData = JSON.parse(data);
    return {
        props: {
            images: parsedData.slice(0, 10)
        }
    }
}

export default function Gallery({ images }) {
    return (
        <>
            <Head>
                <title>相册文件夹</title>
                <meta name="referrer" content="no-referrer" />
            </Head>
            <div style={{
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ImageViewer images={images} />
            </div>
        </>
    )
}
