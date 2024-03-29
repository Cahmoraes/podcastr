import { format, parseISO } from 'date-fns'
import Head from 'next/head'
import { ptBR } from 'date-fns/locale'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from '../../contexts/PlayerContext'
// import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'
import axios from 'axios'

interface IEpisode {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
  description: string
}

interface EpisodeProps {
  episode: IEpisode
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()

  return (
    <div className={styles.episodeContainer}>
      <Head>
        <title>{`${episode.title} | Podcastr`}</title>
      </Head>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
            alt={episode.title}
          />

          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: episode.description,
          }}
        />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const { data } = await api.get('/api/episodes', {
  //   params: {
  //     _limit: 2,
  //     _sort: 'published_at',
  //     _order: 'desc',
  //   },
  // })

  const result = await axios.get(
    'https://mocki.io/v1/24b564ae-61cb-46a8-8466-fc518b368707',
  )

  const paths = result.data.episodes.map((episode) => ({
    params: { slug: episode.id },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params
  // const { data } = await api.get(`/api/episodes/${slug}`)

  const result = await axios.get(
    'https://mocki.io/v1/24b564ae-61cb-46a8-8466-fc518b368707',
  )

  const episodeFiltered = result.data.episodes.find(
    (episode) => episode.id === slug,
  )

  const episode = {
    id: episodeFiltered.id,
    title: episodeFiltered.title,
    thumbnail: episodeFiltered.thumbnail,
    members: episodeFiltered.members,
    publishedAt: format(parseISO(episodeFiltered.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    duration: Number(episodeFiltered.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episodeFiltered.file.duration),
    ),
    description: episodeFiltered.description,
    url: episodeFiltered.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // hours
  }
}
