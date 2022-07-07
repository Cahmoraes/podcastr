import { NextApiRequest, NextApiResponse } from 'next'
import episodes from '../../../../server.json'

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  const { slug } = request.query
  const episode = episodes.episodes.find(episode => episode.id === slug)

  response.json(episode)
}