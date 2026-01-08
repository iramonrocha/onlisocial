import jwt from "jsonwebtoken"
import { getEnv } from "@/utils/getEnv"

export const createToken = (id: string) => {
  try {
    const token = jwt.sign(
      { id },
      getEnv("JWT_SECRET", "private"),
      { expiresIn: "1h" }
    )
    return token
  } catch {
    return null
  }
}