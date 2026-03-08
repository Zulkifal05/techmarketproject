export default function isCloudinaryUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.hostname.endsWith("res.cloudinary.com")
  } catch {
    return false
  }
}