import { NextApiRequest, NextApiResponse } from 'next'
import episodes from '../../../../server.json'

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  response.json(episodes)
}