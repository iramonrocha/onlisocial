import jwt from "jsonwebtoken"
import { getEnv } from "@/utils/getEnv"

export const verifyToken = (token: string): any => {
  try {
    if (token && typeof token === "string") {
      const decoded = jwt.verify(
        token,
        getEnv("JWT_SECRET", "private"),
      )
      return decoded
    }
    return null
  } catch {
    return null
  }
}