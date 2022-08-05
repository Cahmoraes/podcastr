import { NextApiRequest, NextApiResponse } from 'next'
// import { api } from '../../../services/api'
import data from '../../../../server.json'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { slug } = request.query
  const episode = data.episodes.find((episode) => episode.id === slug)
  response.status(200).json(episode)
}
