# API Contracts - Auth Endpoints

## Base URL
```
http://localhost:4000
```

---

## 1. Login Manual

### Endpoint
```http
POST /auth/login
```

### Headers
```http
Content-Type: application/json
```

### Request Body
```typescript
{
  email: string;        // Email del usuario (requerido)
  userId?: string;      // ID del usuario (opcional)
  password?: string;    // Contraseña (opcional)
}
```

#### Ejemplo Request
```json
{
  "email": "usuario@ejemplo.com",
  "userId": "user123",
  "password": "miPassword123"
}
```

### Response Body
```typescript
{
  access_token: string;
  user: {
    userId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  }
}
```

#### Ejemplo Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ1c3VhcmlvQGVqZW1wbG8uY29tIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE2NDAwODY0MDB9.signature",
  "user": {
    "userId": "user123",
    "email": "usuario@ejemplo.com",
    "firstName": null,
    "lastName": null
  }
}
```

### Status Codes
- `200 OK` - Login exitoso
- `400 Bad Request` - Datos inválidos
- `500 Internal Server Error` - Error del servidor

---

## 2. Login con Google (Inicio)

### Endpoint
```http
GET /auth/google
```

### Headers
Ninguno requerido

### Request Body
Ninguno

### Response
Redirige automáticamente a Google OAuth para autenticación

### Status Codes
- `302 Found` - Redirección a Google

---

## 3. Google OAuth Callback

### Endpoint
```http
GET /auth/google/callback
```

### Headers
Ninguno (manejado por Google OAuth)

### Query Parameters
Manejados automáticamente por Google OAuth:
- `code` - Código de autorización
- `state` - Estado de la sesión

### Response Body
```typescript
{
  message: string;
  access_token: string;
  user: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }
}
```

#### Ejemplo Response (200 OK)
```json
{
  "message": "Usuario autenticado por Google",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc2ODI5MjgyOTIiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE2NDAwODY0MDB9.signature",
  "user": {
    "userId": "117682928292",
    "email": "user@gmail.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

### Status Codes
- `200 OK` - Autenticación exitosa
- `401 Unauthorized` - Autenticación fallida
- `500 Internal Server Error` - Error del servidor

---

## 4. Obtener Perfil (Ruta Protegida)

### Endpoint
```http
GET /auth/profile
```

### Headers
```http
Authorization: Bearer {access_token}
```

#### Ejemplo Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ1c3VhcmlvQGVqZW1wbG8uY29tIn0.signature
```

### Request Body
Ninguno

### Response Body
```typescript
{
  message: string;
  user: {
    userId: string;
    email: string;
  }
}
```

#### Ejemplo Response (200 OK)
```json
{
  "message": "Perfil del usuario",
  "user": {
    "userId": "user123",
    "email": "usuario@ejemplo.com"
  }
}
```

### Status Codes
- `200 OK` - Token válido, perfil retornado
- `401 Unauthorized` - Token inválido, expirado o no proporcionado
- `500 Internal Server Error` - Error del servidor

---

## 5. Verificar Token

### Endpoint
```http
POST /auth/verify-token
```

### Headers
```http
Content-Type: application/json
```

### Request Body
```typescript
{
  token: string;  // JWT token a verificar
}
```

#### Ejemplo Request
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ1c3VhcmlvQGVqZW1wbG8uY29tIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE2NDAwODY0MDB9.signature"
}
```

### Response Body (Token Válido)
```typescript
{
  valid: boolean;
  payload: {
    sub: string;      // User ID
    email: string;    // Email del usuario
    iat: number;      // Issued at (timestamp)
    exp: number;      // Expiration (timestamp)
  }
}
```

#### Ejemplo Response - Token Válido (200 OK)
```json
{
  "valid": true,
  "payload": {
    "sub": "user123",
    "email": "usuario@ejemplo.com",
    "iat": 1640000000,
    "exp": 1640086400
  }
}
```

### Response Body (Token Inválido)
```typescript
{
  valid: boolean;
  message: string;
}
```

#### Ejemplo Response - Token Inválido (200 OK)
```json
{
  "valid": false,
  "message": "Token inválido o expirado"
}
```

### Status Codes
- `200 OK` - Verificación completada (ver campo `valid`)
- `400 Bad Request` - Token no proporcionado
- `500 Internal Server Error` - Error del servidor

---

## 6. Logout

### Endpoint
```http
GET /auth/logout
```

### Headers
Ninguno requerido

### Request Body
Ninguno

### Response Body
```typescript
{
  message: string;
}
```

#### Ejemplo Response (200 OK)
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

### Status Codes
- `200 OK` - Logout exitoso
- `500 Internal Server Error` - Error al cerrar sesión

---

## Tipos de Datos Compartidos

### JWT Payload
```typescript
interface JwtPayload {
  sub: string;      // Subject (User ID)
  email: string;    // Email del usuario
  iat?: number;     // Issued At (timestamp)
  exp?: number;     // Expiration Time (timestamp)
}
```

### User Object
```typescript
interface User {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
```

### Login Response
```typescript
interface LoginResponse {
  access_token: string;
  user: {
    userId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  }
}
```

---

## Códigos de Error Comunes

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Notas de Implementación

### Formato del Token JWT
Los tokens JWT deben enviarse en el header Authorization con el formato:
```
Authorization: Bearer {token}
```

### Expiración del Token
- Por defecto: 24 horas
- Configurable en variable de entorno `JWT_EXPIRATION`

### Validación del Token
- Los tokens se validan automáticamente en rutas protegidas con `@UseGuards(JwtAuthGuard)`
- El payload del token se extrae y está disponible en `request.user`

### Seguridad
- Siempre usar HTTPS en producción
- Los tokens no se invalidan hasta su expiración natural
- Implementar refresh tokens para mayor seguridad (recomendado)

---

## Ejemplos de Uso

### cURL

#### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "userId": "user123"
  }'
```

#### Profile (con token)
```bash
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Verify Token
```bash
curl -X POST http://localhost:4000/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@ejemplo.com',
    userId: 'user123'
  })
});

const { access_token, user } = await loginResponse.json();

// Usar el token
const profileResponse = await fetch('http://localhost:4000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

const profile = await profileResponse.json();
```

### TypeScript/Axios

```typescript
import axios from 'axios';

// Login
const loginResponse = await axios.post('http://localhost:4000/auth/login', {
  email: 'usuario@ejemplo.com',
  userId: 'user123'
});

const { access_token } = loginResponse.data;

// Configurar axios con el token
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

// Usar en rutas protegidas
const profileResponse = await api.get('/auth/profile');
console.log(profileResponse.data);
```

---

## Postman Collection

### Variables de Entorno Sugeridas
```json
{
  "base_url": "http://localhost:4000",
  "access_token": "{{access_token}}"
}
```

### Pre-request Script para Login
```javascript
// Después del login, guarda el token
pm.test("Save access token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.access_token);
});
```

### Authorization en Rutas Protegidas
- Type: Bearer Token
- Token: `{{access_token}}`
