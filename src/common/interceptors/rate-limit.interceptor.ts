import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private store: RateLimitStore = {};
  private readonly limit = 100; // requests per window
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getClientKey(request);

    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Clean old entries
    Object.keys(this.store).forEach((k) => {
      if (this.store[k].resetTime < windowStart) {
        delete this.store[k];
      }
    });

    // Check rate limit
    if (!this.store[key]) {
      this.store[key] = { count: 0, resetTime: now };
    }

    if (this.store[key].count >= this.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(
            (this.store[key].resetTime + this.windowMs - now) / 1000,
          ),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.store[key].count++;

    return next.handle();
  }

  private getClientKey(request: Request): string {
    // Use IP address as key, or user ID if authenticated
    const user = (request as any).user;
    if (user?.userId) {
      return `user:${user.userId}`;
    }
    return `ip:${request.ip || request.connection.remoteAddress}`;
  }
}
