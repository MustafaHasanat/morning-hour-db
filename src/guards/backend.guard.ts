import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { compare } from 'bcrypt';

/**
 * A guard to protect the usage of the endpoint so only the frontend side can make requests
 * using a header named 'backend-access-token' that holds the value of the secret hashed token
 * using 'bcrypt' as follows:
 *
 * const hashed = await hash(BACKEND_ACCESS_TOKEN, 12);
 */
@Injectable()
export class BackendGuard implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const backendAccessToken = req.headers['backend-access-token'] || '';

    const isCorrect = await compare(
      process.env.BACKEND_ACCESS_TOKEN,
      backendAccessToken,
    );

    if (isCorrect) {
      next();
    } else {
      res.status(401).json({
        message: 'Unauthorized request',
        data:
          backendAccessToken === ''
            ? 'You have to provide a valid backend access token'
            : `Your token (${backendAccessToken}) is invalid`,
        status: 401,
      });
    }
  }
}
