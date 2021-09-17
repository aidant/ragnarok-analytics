import ago from 's-ago'
import prettyMs from 'pretty-ms'

export const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.substring(1)
}

export const formatDate = (date: string): string => {
  return capitalize(ago(new Date(date)))
}

export const formatDuration = (create: string, complete: string): string => {
  return capitalize(
    prettyMs(new Date(complete).getTime() - new Date(create).getTime(), { compact: true })
  )
}
