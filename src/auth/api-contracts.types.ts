/**
 * API Contracts - TypeScript Interfaces
 * 
 * Este archivo contiene todas las interfaces y tipos para los endpoints de autenticación.
 * Puedes importar estos tipos en tu código para tener type-safety.
 */

// ============================================
// REQUEST CONTRACTS (DTOs)
// ============================================

/**
 * POST /auth/login
 */
export interface LoginRequestDto {
  email: string;
  userId?: string;
  password?: string;
}

/**
 * POST /auth/verify-token
 */
export interface VerifyTokenRequestDto {
  token: string;
}

// ============================================
// RESPONSE CONTRACTS
// ============================================

/**
 * Response del login y Google callback
 */
export interface LoginResponseDto {
  access_token: string;
  user: UserDto;
}

/**
 * Response de Google callback (incluye mensaje adicional)
 */
export interface GoogleCallbackResponseDto extends LoginResponseDto {
  message: string;
}

/**
 * Response del endpoint /auth/profile
 */
export interface ProfileResponseDto {
  message: string;
  user: AuthenticatedUserDto;
}

/**
 * Response del endpoint /auth/verify-token (válido)
 */
export interface VerifyTokenValidResponseDto {
  valid: true;
  payload: JwtPayload;
}

/**
 * Response del endpoint /auth/verify-token (inválido)
 */
export interface VerifyTokenInvalidResponseDto {
  valid: false;
  message: string;
}

/**
 * Union type para verify-token
 */
export type VerifyTokenResponseDto = 
  | VerifyTokenValidResponseDto 
  | VerifyTokenInvalidResponseDto;

/**
 * Response del endpoint /auth/logout
 */
export interface LogoutResponseDto {
  message: string;
}

// ============================================
// SHARED TYPES
// ============================================

/**
 * Información del usuario en respuestas de login
 */
export interface UserDto {
  userId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

/**
 * Usuario autenticado (del JWT payload)
 */
export interface AuthenticatedUserDto {
  userId: string;
  email: string;
}

/**
 * Payload del JWT Token
 */
export interface JwtPayload {
  sub: string;      // User ID
  email: string;    // Email del usuario
  iat?: number;     // Issued At (timestamp)
  exp?: number;     // Expiration Time (timestamp)
}

/**
 * Información del usuario desde Google OAuth
 */
export interface GoogleUserProfile {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
  accessToken: string;
}

// ============================================
// ERROR RESPONSES
// ============================================

/**
 * Error estándar de NestJS
 */
export interface ErrorResponseDto {
  statusCode: number;
  message: string | string[];
  error: string;
}

/**
 * Error 400 - Bad Request
 */
export interface BadRequestErrorDto extends ErrorResponseDto {
  statusCode: 400;
  error: 'Bad Request';
}

/**
 * Error 401 - Unauthorized
 */
export interface UnauthorizedErrorDto extends ErrorResponseDto {
  statusCode: 401;
  error: 'Unauthorized';
  message: 'Unauthorized';
}

/**
 * Error 500 - Internal Server Error
 */
export interface InternalServerErrorDto extends ErrorResponseDto {
  statusCode: 500;
  error: 'Internal Server Error';
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard para verificar si el token es válido
 */
export function isValidToken(
  response: VerifyTokenResponseDto
): response is VerifyTokenValidResponseDto {
  return response.valid === true;
}

/**
 * Type guard para verificar si el token es inválido
 */
export function isInvalidToken(
  response: VerifyTokenResponseDto
): response is VerifyTokenInvalidResponseDto {
  return response.valid === false;
}

// ============================================
// EJEMPLO DE USO
// ============================================

/*
// En tu servicio de frontend:

import { 
  LoginRequestDto, 
  LoginResponseDto,
  VerifyTokenResponseDto,
  isValidToken
} from './api-contracts';

async function login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

async function verifyToken(token: string): Promise<boolean> {
  const response = await fetch('http://localhost:4000/auth/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const data: VerifyTokenResponseDto = await response.json();
  
  if (isValidToken(data)) {
    console.log('Token válido:', data.payload);
    return true;
  } else {
    console.log('Token inválido:', data.message);
    return false;
  }
}

// Uso:
const loginData: LoginRequestDto = {
  email: 'user@example.com',
  userId: '123'
};

const result = await login(loginData);
console.log('Access Token:', result.access_token);
console.log('User:', result.user);

// Verificar token
const isValid = await verifyToken(result.access_token);
*/
