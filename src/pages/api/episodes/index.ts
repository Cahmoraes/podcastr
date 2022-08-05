import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
// import data from '../../../../server.json'
// import { api } from '../../../services/api'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const result = await axios.get(
    'https://mocki.io/v1/24b564ae-61cb-46a8-8466-fc518b368707',
  )
  response.status(200).json(result.data)
}
