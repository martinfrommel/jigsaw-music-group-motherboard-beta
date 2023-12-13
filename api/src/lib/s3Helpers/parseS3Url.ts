export function parseS3Url(url: string) {
  const { hostname, pathname } = new URL(url)
  const bucket = hostname.split('.')[0]
  const key = pathname.substring(1) // Remove the leading slash
  const decodedKey = decodeURIComponent(key)
  return { bucket, decodedKey }
}
