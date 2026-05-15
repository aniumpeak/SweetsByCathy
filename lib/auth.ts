import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback-secret-change-me"
)

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret)
  return token
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function getTokenFromHeader(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null
  return authHeader.slice(7)
}

export async function isAuthenticatedFromHeader(authHeader: string | null): Promise<boolean> {
  const token = await getTokenFromHeader(authHeader)
  if (!token) return false
  return verifySession(token)
}
