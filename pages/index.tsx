import Head from 'next/head'
import Link from 'next/link'

export default function Home(): JSX.Element {
  return (
    <div className="container">
      <Head>
        <title>Code Space</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ul>
          <li>
            <Link href="/react_bmap">百度地图 React-BMap</Link>
          </li>
        </ul>
      </main>
    </div>
  )
}
