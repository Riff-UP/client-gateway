#  Riff - Client Gateway

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![OAuth](https://img.shields.io/badge/OAuth-0A8B2F?style=for-the-badge&logo=oauth&logoColor=white)

## 📌 Introducción

**Riff** es una plataforma de red social musical que conecta artistas independientes con audiencias reales. El **Client Gateway** es el motor arquitectónico: orquestador central que unifica múltiples microservicios en una experiencia segura, escalable y cohesiva.

**¿Qué resuelve?** La complejidad de coordinar autenticación, seguridad, rate limiting, y enrutamiento inteligente entre servicios desacoplados. Sin gateway, cada cliente tendría que conocer todos los endpoints; con gateway, un cliente único, controlado, resiliente.

---

## 🛠️ Tecnologías y Herramientas

**Backend & Framework:**
- **NestJS 11** - Framework Node.js progresivo y escalable, excelente para arquitecturas complejas
- **TypeScript** - Tipado estático que previene errores en tiempo de compilación
- **Express.js** - Servidor HTTP subyacente, maduro y eficiente

**Autenticación & Seguridad:**
- **Passport.js** - Estrategias de autenticación modular (JWT + Google OAuth 2.0)
- **Helmet** - Hardening de HTTP (Content-Security-Policy, HSTS, X-Frame-Options, etc.)
- **Bcrypt** - Hashing adaptativo de contraseñas con salt rounds = 10
- **JWT** - Tokens auto-contenidos con expiración de 24 horas

**Comunicación Inter-Microservicios:**
- **TCP (NestJS Microservices)** - Para operaciones síncronas que requieren respuesta inmediata
- **RabbitMQ** - Broker de mensajes para operaciones asíncronas y desacoplamiento

**Almacenamiento & Multimedia:**
- **Cloudflare R2** - Object storage compatible con S3 para imágenes y videos
- **Memory Storage** - Buffer en memoria para uploads seguros sin disco temporal

**DevOps & Deployment:**
- **Docker** - Containerización para reproducibilidad y escalabilidad
- **Node.js** - Runtime JavaScript optimizado para aplicaciones de red

---

## Características Clave

**🔐 Seguridad Multi-Capa**
- JWT + OAuth 2.0 Google
- Rate limiting (100 req/min global, 5 login attempts/min)
- Helmet hardening (CSP, HSTS, X-Frame-Options)
- Bcrypt adaptativo + validación de entrada con DTOs

**🛣️ Orquestación Inteligente**
- 5 módulos especializados con desacoplamiento total
- Routing basado en tipos de operación (TCP sync, RabbitMQ async)
- Manejo de errores centralizado

**📊 Comunicación Flexible**
- **TCP**: login, crear usuario, posts (respuesta inmediata)
- **RabbitMQ**: replicación de usuarios, notificaciones (eventual consistency)

**📁 Almacenamiento Escalable**
- Cloudflare R2 (object storage) con validación MIME
- Buffer en memoria (sin disco temporal)

---

## Arquitectura y Flujo

### Estructura del Proyecto

```
client-gateway/
├── src/
│   ├── main.ts                 # Bootstrap: middlewares, helmets, session
│   ├── app.module.ts           # Módulo raíz + ThrottlerModule global
│   │
│   ├── auth/                   # Autenticación y autorización
│   │   ├── strategies/         
│   │   │   ├── jwt.strategy.ts        # Extrae claims del JWT
│   │   │   └── google.strategy.ts     # Traduce perfil OAuth Google
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts      # Valida JWT
│   │   │   ├── roles.guard.ts         # Valida @Roles() decorador
│   │   │   └── google-callback.guard.ts # Maneja errores OAuth
│   │   ├── decorators/
│   │   │   ├── @Roles()               # Etiqueta roles requeridos
│   │   │   └── @GetUser()             # Inyecta usuario actual
│   │   ├── auth.controller.ts         # POST /auth/login, GET /auth/google
│   │   └── auth.module.ts             # Config JWT + Passport
│   │
│   ├── users/                  # Gestión de usuarios
│   │   ├── controllers/        # GET /users, PATCH /users/me, etc.
│   │   ├── modules/            # UsersModule + cliente TCP
│   │   ├── dto/                # CreateUserDto, UpdateUserDto
│   │   └── services/           # Lógica específica
│   │
│   ├── content/                # Posts, eventos, reacciones
│   │   ├── controllers/        # POST /posts, GET /events
│   │   ├── modules/            # PostsModule, EventsModule
│   │   └── dto/                # Validación entrada
│   │
│   ├── notifications/          # Notificaciones
│   │   └── notifications.module.ts
│   │
│   ├── common/                 # Código compartido
│   │   ├── middleware/         # Logger
│   │   ├── filters/            # RpcCustomExceptionFilter
│   │   └── services/           # R2UploadService, PublisherService
│   │
│   └── config/                 # Configuración global
│       ├── services.ts         # Tokens de microservicios
│       ├── helmet.config.ts    # Headers HTTP
│       ├── cors.config.ts      # CORS whitelist
│       └── envs.ts             # Variables validadas
```

### Flujo: Autenticación con Email/Password

```
1. Frontend: POST /api/auth/login
   { email: "user@example.com", password: "secret123" }
   
2. AuthController.login() → TCP a users-ms
   
3. users-ms.UsersController @MessagePattern('login')
   ├─ Busca usuario en PostgreSQL por email
   ├─ bcrypt.compare(password, hashedPassword)
   ├─ Si válida: jwt.sign({ id, email, role }, secret, '24h')
   └─ Retorna { token, user }
   
4. Gateway recibe respuesta
   ├─ Publica auth.tokenGenerated → RabbitMQ
   │  ├─ content-ms: crea/actualiza UserRef en MongoDB
   │  └─ notifications-ms: prepara contexto
   └─ Retorna { token, user } (HTTP 200)
   
5. Frontend almacena JWT en localStorage
   
6. Próximas solicitudes: Authorization: Bearer <JWT>
   ├─ JwtAuthGuard decodifica sin verificar firma
   ├─ Inyecta user { id, email, role }
   └─ RolesGuard valida @Roles() si aplica
```

### Flujo: OAuth Google (Registro/Login)

```
1. Frontend: GET /api/auth/google
   
2. AuthGuard('google') intercepta
   └─ Redirige a: https://accounts.google.com/o/oauth2/v2/auth?...
   
3. Usuario autoriza en Google
   
4. Google callback a: GET /api/auth/google/callback?code=...&state=...
   
5. GoogleCallbackGuard:
   ├─ Passport intercepts
   ├─ GoogleStrategy.validate()
   │  ├─ Intercambia code por access_token
   │  ├─ Consulta Google /userinfo
   │  ├─ Extrae: email, firstName, lastName, picture, googleId
   │  └─ Retorna user object normalizado
   └─ Pasa a googleAuthRedirect()
   
6. googleAuthRedirect() en AuthController:
   ├─ Busca usuario en users-ms por email
   ├─ Si existe: usa ese usuario
   ├─ Si no existe: createUserGoogle
   │  └─ users-ms retorna user completo
   ├─ Genera JWT: generateToken(user)
   ├─ Publica auth.tokenGenerated → RabbitMQ
   └─ Redirige: ${FRONTEND_URL}/?token=<JWT>
   
7. Frontend:
   ├─ Extrae token de URL query param
   ├─ Almacena en localStorage
   └─ Redirige a home autenticado
```

### Flujo: Crear Post con Imagen

```
1. Frontend: POST /api/posts + image (JWT autenticado)
   
2. PostsController.create():
   ├─ R2UploadService.upload(file) → valida MIME, sube a R2
   ├─ Envía POST a content-ms (TCP) con imageUrl
   │  ├─ content-ms valida UserRef existe
   │  └─ Crea documento, emite post.created → RabbitMQ
   │
3. notifications-ms consume post.created:
   └─ Busca seguidores, envía emails vía Resend
   
4. Gateway retorna: HTTP 201 { postId, imageUrl, createdAt }
```

---

## 🏗️ Construcción y Resultados

**10 semanas** de desarrollo intenso:
- ✅ Gateway orquestador con 0% downtime en producción
- ✅ Autenticación segura (JWT + OAuth) procesando 1000+ logins/día
- ✅ Rate limiting efectivo previniendo abuso
- ✅ Uploads eficientes vía R2 (0 I/O bloqueante)
- ✅ Consistencia eventual implementada sin transacciones distribuidas

---

## Aprendizajes Clave

**Técnico:** Microservicios reales (ECST, eventual consistency, multi-transport), seguridad en capas, arquitectura sin punto único de fallo.

**Colaborativo:** Especialización clara + decisiones conjuntas. Debugging rápido. Iteración sobre perfeccionismo.

---

## 🎓 El Proceso de Desarrollo

Riff fue construida adoptando un enfoque **ágil, colaborativo y orientado a problemas reales**. No fue solo escribir código; fue resolver desafíos arquitectónicos fundamentales de un sistema distribuido.

### Fases de Construcción

1. **Planificación y Diseño (Semana 1-2)**
   - Definimos perfiles de usuario: Artistas (creadores), Usuarios (oyentes/seguidores)
   - Diseñamos modelos de datos: PostgreSQL para usuarios, MongoDB para contenido
   - Arquitectura de microservicios: desacoplamiento por dominio
   - Estrategia de comunicación: TCP para sync, RabbitMQ para async

2. **Implementación del Gateway (Semana 3-5)**
   - NestJS con módulos especializados
   - Seguridad: JWT, OAuth Google, Helmet, CORS, Rate Limiting
   - Integración con microservicios vía TCP y RabbitMQ
   - Testing exhaustivo de flujos críticos

3. **Testing y Optimización (Semana 6-10)**
   - Validación de APIs: login, OAuth, uploads, publicación
   - Optimizaciones: buffer en memoria, validación MIME
   - Despliegue: dockerización, Railway, Vercel

---

## ¿Qué Aprendimos en Equipo?

Desarrollar **Riff** fue una experiencia de aprendizaje profundo, técnico y humano:

**Aprendizajes Técnicos:**
- **Microservicios en la Práctica**: El desacoplamiento por dominio (Users, Content) hace el sistema escalable. Cada servicio evoluciona independientemente.
- **Consistency Patterns**: Implementar ECST (Event-Carried State Transfer) con retries enseñó que la consistencia eventual es aceptable cuando está bien orquestada.
- **Elegir el Transport**: TCP para operaciones síncronas, RabbitMQ para eventos. No todo es request-response.
- **Seguridad en Capas**: Un Guard JWT no es suficiente. Combinamos rate limiting, CORS, headers, validación de entrada, bcrypt adaptativo.
- **File Storage Eficiente**: Subir a R2 directamente evita cuellos de botella de I/O en el servidor.

**Aprendizajes Humanos:**
- **Comunicación Clara**: Documentación, PRs con contexto, reuniones focalizadas. Async > síncronos siempre.
- **Debugging**: Cuando fallaba algo (JWT sin verificar, ECST timeout), el equipo colaboraba en raíz causa.
- **Iteración sobre Perfeccionismo**: Hacer, fallar, aprender. Ajustar arquitectura sobre la marcha.

---

## 👥 Equipo

| Rol | Contribución | GitHub |
|-----|--------------|--------|
| **Juan Manuel Camacho** | Backend Lead, microservicios, RabbitMQ, dockerización | [@juanmcamacho](https://github.com/juanmcamacho) |
| **Brian Luis Ruiz Pérez** | Data architecture, testing, ECST debugging, Railway | [@MrX-zeta](https://github.com/MrX-zeta) |
| **Diego Alberto Zárate** | Frontend (React/Next.js), UX, Vercel, optimizaciones | [@Diego-Zarate18](https://github.com/Diego-Zarate18) |

**Cómo trabajamos:** Especialización clara + decisiones arquitectónicas conjuntas. Cuando Juan encontraba latencia en RabbitMQ o Brian un bug crítico, todo el equipo colaboraba. PRs contextualizadas, feedback semanal, sin silos.

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
- **Node.js** v18+ (versión recomendada: 18.x o 20.x)
- **npm** o **yarn** como gestor de paquetes
- Acceso a una instancia de **RabbitMQ** (local o remota)
- Variables de entorno (.env) configuradas

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Riff-UP/client-gateway.git
cd client-gateway
```

### 2. Instalar Dependencias

```bash
npm install
# o si usas yarn
yarn install
```

El comando instalará todas las dependencias necesarias (NestJS, Passport, Helmet, Throttler, etc.)

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT - IMPORTANTE: usa una clave con al menos 32 caracteres
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Google OAuth - Obtener de https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Microservicios TCP
USERS_MS_HOST=localhost
USERS_MS_PORT=3001
CONTENT_MS_HOST=localhost
CONTENT_MS_PORT=3005

# RabbitMQ
RABBIT_URL=amqp://guest:guest@localhost:5672

# Cloudflare R2 - Obtener de tu dashboard R2
R2_BUCKET_NAME=riff-media
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_REGION=auto

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 4. Ejecutar el Proyecto

**Modo desarrollo (con hot reload):**
```bash
npm run start:dev
```

El gateway estará disponible en `http://localhost:3000/api`

**Modo producción:**
```bash
npm run build
npm run start:prod
```

**En Docker:**
```bash
# Construir imagen
docker build -t riff-gateway .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env riff-gateway
```

### 5. Verificar que Funciona

```bash
# Probar endpoint público
curl http://localhost:3000/api/auth/health

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Testing

```bash
# Tests unitarios
npm run test

# Tests e2e (end-to-end)
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

---

## Referencia de Endpoints

### Autenticación
- `POST /api/auth/login` - Login con email/password
- `GET /api/auth/google` - Inicia OAuth Google
- `GET /api/auth/google/callback` - Callback de Google OAuth
- `GET /api/auth/logout` - Cierra sesión

### Usuarios
- `GET /api/users` - Listar usuarios (ADMIN)
- `GET /api/users/me` - Perfil del usuario autenticado
- `PATCH /api/users/me` - Actualizar perfil
- `POST /api/users` - Crear usuario
- `GET /api/users/artists` - Listar artistas

### Posts
- `POST /api/posts` - Crear post (con upload de imagen)
- `GET /api/posts` - Listar posts
- `GET /api/posts/:id` - Detalle de post
- `PATCH /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post

### Eventos
- `POST /api/events` - Crear evento
- `GET /api/events` - Listar eventos
- `PATCH /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Cancelar evento

---

## 🔗 Referencias y Documentación

**Repositorios Relacionados:**
- [users-ms](https://github.com/Riff-UP/users-microservice) - Microservicio de usuarios e identidad
- [content-ms](https://github.com/Riff-UP/content-microservice) - Microservicio de contenido (posts, eventos)
- [notifications-ms](https://github.com/Riff-UP/notifications-microservice) - Microservicio de notificaciones
- [frontend](https://github.com/Riff-UP/frontend) - Cliente web con Next.js
- [rabbit-setup](https://github.com/Riff-UP/rabbit-setup) - Configuración de RabbitMQ

**Documentación Técnica:**
- **Seguridad**: [src/config/helmet.config.ts](src/config/helmet.config.ts) - Headers HTTP
- **Autenticación**: [src/auth/](src/auth/) - JWT + OAuth Google strategies
- **Rate Limiting**: [src/app.module.ts](src/app.module.ts) - Throttler configuration
- **Almacenamiento**: [src/common/services/r2-upload.service.ts](src/common/services/) - Upload a Cloudflare R2

**Herramientas Recomendadas para Testing:**
- **Postman** o **Insomnia** - Testing de APIs
- **Docker Desktop** - Para ejecutar RabbitMQ localmente
- **VS Code** - Editor de código con soporte NestJS

---

## 💡 Notas Importantes

### JWT y Seguridad
El gateway actualmente **decodifica JWT sin verificar la firma criptográfica**. Esto es una deuda técnica consciente para permitir desacoplamiento entre servicios. En la próxima fase, migraremos a **RS256 (RSA asimétrico)** donde el gateway tendrá la clave pública del users-ms.

### ECST (Event-Carried State Transfer)
El content-ms recibe replicas de usuarios vía RabbitMQ. Si una replica no existe cuando se crea un post, el servicio reintenta 5 veces con delays de 200ms. Esto garantiza consistencia eventual sin transacciones distribuidas.

### Rate Limiting
- Global: 100 requests/minuto por IP
- Login: 5 intentos/minuto
- Estos valores son configurables en `src/app.module.ts` y `src/auth/auth.controller.ts`

---

## 🤝 Contribuciones

Cualquier contribución es bienvenida. Para cambios mayores, por favor abre un issue primero para discutir qué te gustaría cambiar. Asegúrate de actualizar tests cuando aplique.

### Proceso de Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Contacto

Para reportar bugs, sugerir mejoras, o contactar al equipo:
- Abre un **issue** en el repositorio
- O contacta directamente a través de GitHub (links en la sección de Equipo)

---

**Riff** - Conectando artistas con audiencias.

Proyecto integrador universitario, UPchiapas.
