# Resumen Rápido de Endpoints

## 📋 Tabla de Endpoints

| # | Método | Endpoint | Auth Requerido | Descripción |
|---|--------|----------|----------------|-------------|
| 1 | POST | `/auth/login` | ❌ | Login manual con email/userId |
| 2 | GET | `/auth/google` | ❌ | Inicia OAuth con Google |
| 3 | GET | `/auth/google/callback` | ❌ | Callback de Google OAuth |
| 4 | GET | `/auth/profile` | ✅ | Obtener perfil del usuario autenticado |
| 5 | POST | `/auth/verify-token` | ❌ | Verificar validez de un token JWT |
| 6 | GET | `/auth/logout` | ❌ | Cerrar sesión |

## 📦 Request/Response Rápido

### 1️⃣ POST /auth/login
```typescript
// REQUEST
{
  "email": "user@example.com",
  "userId": "123"
}

// RESPONSE
{
  "access_token": "eyJhbG...",
  "user": {
    "userId": "123",
    "email": "user@example.com",
    "firstName": null,
    "lastName": null
  }
}
```

### 2️⃣ GET /auth/google
```
Redirige → Google OAuth
```

### 3️⃣ GET /auth/google/callback
```typescript
// RESPONSE
{
  "message": "Usuario autenticado por Google",
  "access_token": "eyJhbG...",
  "user": {
    "userId": "google_id",
    "email": "user@gmail.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

### 4️⃣ GET /auth/profile
```typescript
// HEADER
Authorization: Bearer eyJhbG...

// RESPONSE
{
  "message": "Perfil del usuario",
  "user": {
    "userId": "123",
    "email": "user@example.com"
  }
}
```

### 5️⃣ POST /auth/verify-token
```typescript
// REQUEST
{
  "token": "eyJhbG..."
}

// RESPONSE (válido)
{
  "valid": true,
  "payload": {
    "sub": "123",
    "email": "user@example.com",
    "iat": 1640000000,
    "exp": 1640086400
  }
}

// RESPONSE (inválido)
{
  "valid": false,
  "message": "Token inválido o expirado"
}
```

### 6️⃣ GET /auth/logout
```typescript
// RESPONSE
{
  "message": "Sesión cerrada exitosamente"
}
```

## 🔑 JWT Payload Structure
```typescript
{
  "sub": "user_id",      // User ID
  "email": "user@.com",  // Email
  "iat": 1640000000,     // Issued at
  "exp": 1640086400      // Expires at
}
```

## 📝 Notas Importantes

- **Token Format**: `Authorization: Bearer {token}`
- **Token Expiration**: 24 horas (configurable)
- **Content-Type**: `application/json` para POST requests
- **Base URL**: `http://localhost:4000` (desarrollo)

## 🚀 Testing Rápido

```bash
# 1. Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","userId":"123"}'

# 2. Profile (reemplaza TOKEN)
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer TOKEN"

# 3. Verify Token
curl -X POST http://localhost:4000/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN"}'
```

## 📚 Archivos de Referencia

- **[API_CONTRACTS.md](./API_CONTRACTS.md)** - Documentación completa con ejemplos
- **[api-contracts.types.ts](./src/auth/api-contracts.types.ts)** - Interfaces TypeScript
- **[Auth_API.postman_collection.json](./Auth_API.postman_collection.json)** - Colección de Postman
- **[QUICKSTART_JWT.md](./QUICKSTART_JWT.md)** - Guía de inicio rápido
- **[JWT_IMPLEMENTATION.md](./JWT_IMPLEMENTATION.md)** - Implementación detallada

## 💡 Tips

✅ Guarda el `access_token` después del login  
✅ Incluye "Bearer " antes del token en el header  
✅ Los tokens expiran en 24h por defecto  
✅ Usa `/auth/verify-token` para validar tokens  
✅ Las rutas protegidas retornan 401 sin token válido
