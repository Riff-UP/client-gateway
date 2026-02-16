# Guía Rápida - JWT Authentication

## 🚀 Inicio Rápido

### 1. Configura las Variables de Entorno
Crea un archivo `.env` en la raíz de `client-gateway` con:

```env
PORT=4000

USERS_MICROSERVICE_HOST=localhost
USERS_MICROSERVICE_PORT=3002

JWT_SECRET=mi_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRATION=24h
```

### 2. Instala las Dependencias
Las dependencias ya están instaladas si ejecutaste el setup. Si no:

```bash
npm install @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

### 3. Inicia el Servidor
```bash
npm run start:dev
```

## 🧪 Prueba Rápida

### Opción 1: Con cURL

```bash
# 1. Obtener un token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "userId": "123"}'

# 2. Usa el token (reemplaza TOKEN con el access_token de la respuesta anterior)
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Opción 2: Con Postman/Thunder Client

**Request 1: Login**
- Method: `POST`
- URL: `http://localhost:4000/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "userId": "123"
}
```

**Request 2: Profile (Protected)**
- Method: `GET`
- URL: `http://localhost:4000/auth/profile`
- Headers: `Authorization: Bearer <TU_TOKEN_AQUI>`

### Opción 3: Con JavaScript/Fetch

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    userId: '123'
  })
});

const { access_token } = await loginResponse.json();

// 2. Usar el token en rutas protegidas
const profileResponse = await fetch('http://localhost:4000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

const profile = await profileResponse.json();
console.log(profile);
```

## 📝 Proteger Tus Rutas

### En tu controlador:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';

@Controller('mi-controlador')
export class MiController {
  
  @Get('ruta-protegida')
  @UseGuards(JwtAuthGuard)  // 👈 Agrega esta línea
  miRutaProtegida(@GetUser() user: any) {
    return {
      message: 'Acceso autorizado',
      user
    };
  }
}
```

## 🔑 Endpoints Disponibles

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login manual | ❌ |
| GET | `/auth/google` | Login con Google | ❌ |
| GET | `/auth/google/callback` | Callback de Google | ❌ |
| GET | `/auth/profile` | Obtener perfil | ✅ |
| POST | `/auth/verify-token` | Verificar token | ❌ |
| GET | `/auth/logout` | Cerrar sesión | ❌ |

## 🛠️ Troubleshooting Rápido

**Problema: "Unauthorized"**
- ✅ Verifica que incluyas el header `Authorization: Bearer <token>`
- ✅ Asegúrate que el token no haya expirado (por defecto: 24h)
- ✅ Confirma que JWT_SECRET en .env sea el correcto

**Problema: "Token inválido"**
- ✅ No agregues espacios extra en el token
- ✅ Asegúrate de incluir la palabra "Bearer " antes del token
- ✅ Verifica que copiaste el token completo

**Problema: "Cannot find module"**
- ✅ Ejecuta `npm install` nuevamente
- ✅ Reinicia el servidor con `npm run start:dev`

## 📚 Siguiente Paso

Lee la [documentación completa](./JWT_IMPLEMENTATION.md) para:
- Entender cómo funciona JWT
- Ver más ejemplos de uso
- Aprender sobre mejores prácticas de seguridad
- Implementar funcionalidades avanzadas

## 💡 Ejemplo Completo de Flujo

```typescript
// 1. Cliente hace login
POST /auth/login
{
  "email": "user@example.com",
  "userId": "123"
}

// 2. Servidor responde con token
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "userId": "123",
    "email": "user@example.com"
  }
}

// 3. Cliente guarda el token (localStorage, sessionStorage, etc.)
localStorage.setItem('token', access_token);

// 4. Cliente usa el token en requests protegidos
const token = localStorage.getItem('token');
fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 5. Servidor valida el token y retorna los datos
{
  "data": "información protegida"
}
```

## 🎯 Checklist

- [ ] Variables de entorno configuradas en `.env`
- [ ] JWT_SECRET cambiado por una clave segura
- [ ] Servidor iniciado y funcionando
- [ ] Test de login exitoso (obtener token)
- [ ] Test de ruta protegida exitoso (usar token)
- [ ] Entendimiento básico de cómo proteger rutas

¡Listo! Ahora tienes JWT funcionando en tu gateway 🎉
