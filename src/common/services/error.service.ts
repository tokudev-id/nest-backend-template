import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Injectable()
export class ErrorService {
  createErrorResponse(
    statusCode: number,
    message: string,
    error?: string,
  ): ErrorResponseDto {
    const errorType = error || this.getErrorType(statusCode);
    return new ErrorResponseDto(statusCode, message, errorType);
  }

  throwError(statusCode: number, message: string, error?: string): never {
    const errorType = error || this.getErrorType(statusCode);
    throw new HttpException(
      new ErrorResponseDto(statusCode, message, errorType),
      statusCode,
    );
  }

  throwNotFound(message: string = 'Resource not found'): never {
    this.throwError(HttpStatus.NOT_FOUND, message, 'Not Found');
  }

  throwBadRequest(message: string = 'Bad request'): never {
    this.throwError(HttpStatus.BAD_REQUEST, message, 'Bad Request');
  }

  throwUnauthorized(message: string = 'Unauthorized'): never {
    this.throwError(HttpStatus.UNAUTHORIZED, message, 'Unauthorized');
  }

  throwForbidden(message: string = 'Forbidden'): never {
    this.throwError(HttpStatus.FORBIDDEN, message, 'Forbidden');
  }

  throwConflict(message: string = 'Conflict'): never {
    this.throwError(HttpStatus.CONFLICT, message, 'Conflict');
  }

  throwUnprocessableEntity(message: string = 'Unprocessable entity'): never {
    this.throwError(
      HttpStatus.UNPROCESSABLE_ENTITY,
      message,
      'Unprocessable Entity',
    );
  }

  throwInternalServerError(message: string = 'Internal server error'): never {
    this.throwError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      'Internal Server Error',
    );
  }

  private getErrorType(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      case 429:
        return 'Too Many Requests';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      default:
        return 'Error';
    }
  }
}
