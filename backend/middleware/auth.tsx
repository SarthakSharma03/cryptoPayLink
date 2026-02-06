import jwt from 'jsonwebtoken'
import { config as envConfig } from 'dotenv'
import { jsonResponse } from './jsonResponse'

envConfig()

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return jsonResponse(res, { message: 'Unauthorized' }, 401)
    }

    const secret = process.env.JWT_SECRET
    const payload = jwt.verify(token, secret)
   

   

   
    
    return next()
  } catch (error) {
    return jsonResponse(res, { message: 'Unauthorized' }, 401)
  }
}
