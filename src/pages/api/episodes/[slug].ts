import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
// import { api } from '../../../services/api'
// import data from '../../../../server.json'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { slug } = request.query
  const result = await axios.get(
    'https://mocki.io/v1/24b564ae-61cb-46a8-8466-fc518b368707',
  )
  const episode = result.data.episodes.find((episode) => episode.id === slug)
  response.status(200).json(episode)
}
