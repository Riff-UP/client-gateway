# JWT Authentication Implementation

## Descripción
Esta implementación agrega autenticación JWT (JSON Web Tokens) al gateway de la aplicación, permitiendo que los usuarios se autentiquen y accedan a rutas protegidas.

## Archivos Creados/Modificados

### Nuevos Archivos:
1. **src/auth/strategies/jwt.strategy.ts** - Estrategia de Passport para validar tokens JWT
2. **src/auth/guards/jwt-auth.guard.ts** - Guard para proteger rutas con JWT
3. **src/auth/decorators/get-user.decorator.ts** - Decorador para obtener el usuario del request
4. **src/auth/auth.service.ts** - Servicio para generar y verificar tokens JWT

### Archivos Modificados:
1. **src/auth/auth.module.ts** - Configuración del módulo JWT
2. **src/auth/auth.controller.ts** - Endpoints de autenticación actualizados
3. **src/config/envs.ts** - Variables de entorno para JWT
4. **.env.template** - Template de variables de entorno

## Configuración

### Variables de Entorno
Agrega las siguientes variables a tu archivo `.env`:

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=24h
```

**Importante:** Cambia `JWT_SECRET` por una clave segura en producción.

## Endpoints disponibles

### 1. Login Manual
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "userId": "user123",
  "password": "optional"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "user123",
    "email": "user@example.com",
    "firstName": null,
    "lastName": null
  }
}
```

### 2. Login con Google
```http
GET /auth/google
```
Inicia el flujo de autenticación con Google OAuth.

### 3. Callback de Google
```http
GET /auth/google/callback
```
Google redirige aquí después de la autenticación. Retorna un JWT token.

**Respuesta:**
```json
{
  "message": "Usuario autenticado por Google",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "google_user_id",
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 4. Obtener Perfil (Ruta Protegida)
```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**
```json
{
  "message": "Perfil del usuario",
  "user": {
    "userId": "user123",
    "email": "user@example.com"
  }
}
```

### 5. Verificar Token
```http
POST /auth/verify-token
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (válido):**
```json
{
  "valid": true,
  "payload": {
    "sub": "user123",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234654290
  }
}
```

**Respuesta (inválido):**
```json
{
  "valid": false,
  "message": "Token inválido o expirado"
}
```

### 6. Logout
```http
GET /auth/logout
```

## Uso en Controladores

### Proteger una Ruta
Para proteger una ruta con JWT, usa el guard `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';

@Controller('ejemplo')
export class EjemploController {
  @Get('protegido')
  @UseGuards(JwtAuthGuard)
  rutaProtegida(@GetUser() user: any) {
    return {
      message: 'Acceso autorizado',
      user
    };
  }

  // Obtener solo el email del usuario
  @Get('email')
  @UseGuards(JwtAuthGuard)
  obtenerEmail(@GetUser('email') email: string) {
    return { email };
  }
}
```

## Estructura del JWT Payload

```typescript
{
  sub: string;      // User ID
  email: string;    // Email del usuario
  iat: number;      // Issued at (timestamp)
  exp: number;      // Expiration (timestamp)
}
```

## Testing

### Con cURL:

1. **Obtener un token:**
```bash
curl -X POST http://localhost:4000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "userId": "123"
  }'
```

2. **Usar el token en una ruta protegida:**
```bash
curl -X GET http://localhost:4000/auth/profile \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Con Postman:

1. Crea una request POST a `/auth/login` con el body JSON
2. Copia el `access_token` de la respuesta
3. En las requests protegidas, ve a la pestaña "Authorization"
4. Selecciona "Bearer Token"
5. Pega el token en el campo

## Seguridad

### Mejores Prácticas:
1. **Nunca compartir el JWT_SECRET**: Mantén esta clave segura y diferente en cada ambiente
2. **HTTPS en producción**: Usa siempre HTTPS para evitar interceptación de tokens
3. **Tokens de corta duración**: Considera usar tokens de refresh para mayor seguridad
4. **Validación del lado del servidor**: Los tokens siempre se validan en el backend

### Consideraciones:
- Los tokens JWT son stateless (no se almacenan en el servidor)
- Una vez emitido, un token es válido hasta su expiración
- Para "logout" real, considera implementar una blacklist de tokens

## Próximos Pasos

### Mejoras Recomendadas:
1. **Refresh Tokens**: Implementar tokens de actualización para mayor seguridad
2. **Roles y Permisos**: Agregar roles al payload JWT y crear guards basados en roles
3. **Blacklist de Tokens**: Sistema para invalidar tokens antes de su expiración
4. **Rate Limiting**: Proteger endpoints de login contra fuerza bruta
5. **Integración con Users Microservice**: Validar usuarios contra la base de datos

## Troubleshooting

### Error: "Token inválido"
- Verifica que el token no haya expirado
- Asegúrate de incluir "Bearer " antes del token en el header
- Confirma que JWT_SECRET sea el mismo que cuando se generó el token

### Error: "Unauthorized"
- Verifica que el guard `JwtAuthGuard` esté aplicado correctamente
- Asegúrate de enviar el header `Authorization` con el token
- Verifica que el token sea válido usando el endpoint `/auth/verify-token`

## Recursos Adicionales

- [NestJS JWT Documentation](https://docs.nestjs.com/security/authentication#jwt-functionality)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)
- [JWT.io - Debugger](https://jwt.io/)
