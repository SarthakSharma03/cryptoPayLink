import { Response } from "express"

export const jsonResponse = (res:Response, payload:any, status = 200) => {
  return res.status(status).json(payload)
}
