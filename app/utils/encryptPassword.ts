import Chance from "chance"
import { getEnv } from "@/utils/getEnv"

export const encryptPassword = (password: string) => {
    return new Chance(`${getEnv("PWD_SECRET", "private")}/${password}`).hash()
}

export const comparePassword = (password: string, storedHash: string) => {
    const hashedPassword = encryptPassword(password)
    return hashedPassword === storedHash
}