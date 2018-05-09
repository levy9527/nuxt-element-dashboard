import fecha from 'fecha'

export function formatDate(time, format) {
  if (!time) {
    return ''
  }
  let date = new Date(time)

  return fecha.format(date, format)
}
