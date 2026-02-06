export const jsonResponse = (res, payload, status = 200) => {
  return res.status(status).json(payload)
}
