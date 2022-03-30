import type { AppProps } from 'next/app'
import '@styles/globals.css'

function Application({ Component, pageProps }: AppProps) : JSX.Element {
  return <Component {...pageProps} />
}

export default Application
