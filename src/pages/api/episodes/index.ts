import { NextApiRequest, NextApiResponse } from 'next'
import data from '../../../../server.json'
// import { api } from '../../../services/api'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  response.status(200).json(data)
}
