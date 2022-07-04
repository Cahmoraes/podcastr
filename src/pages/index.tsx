import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { useContext } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetStaticProps } from 'next'
import { api } from '../services/api'
import { PlayerContext } from '../contexts/PlayerContext'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'


import styles from './home.module.scss'
interface Episode {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
}

interface HomeProps {
  allEpisodes: Episode[]
  latestEpisodes: Episode[]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  {episode.title}
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>
              <button className={styles.buttonPlay} type="button" onClick={() => playList(episodeList, index)}>
                <img src="/play-green.svg" alt="Tocar episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th className={styles.hideOnMobile}></th>
              <th>Podcast</th>
              <th className={styles.hideOnMobile}>Integrantes</th>
              <th>Data</th>
              <th className={styles.hideOnMobile}>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td className={styles.hideOnMobile} style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    {episode.title}
                  </Link>
                </td>
                <td className={styles.hideOnMobile}>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td className={styles.hideOnMobile}>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 // 8 hours
  }
}