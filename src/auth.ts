import { sign } from 'jsonwebtoken'
import { User } from './entity/User';

export const createAccessToken = (user: User) => {
  return sign({userId: user.id, userEmail: user.email}, process.env.ACCESSKEY_JWT!, {
    expiresIn: "10m"
  });
};

export const createRefreshToken = (user: User) => {
  return sign({userId: user.id, userEmail: user.email}, process.env.REFRESH_JWT_KEY!, {
    expiresIn: "7d"
  }); 
}