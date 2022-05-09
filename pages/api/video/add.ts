import { readFileSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Video } from 'pages/videos'

export default function handler(req: NextApiRequest, res: NextApiResponse) : void {
    const data = readFileSync('data/videos/list.json', { encoding: 'utf-8' })
    res.status(200).json({ status: 0, data: JSON.parse(data) })
}
