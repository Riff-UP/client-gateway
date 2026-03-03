# Client Gateway — Endpoints Completos

> Prefijo global: `/api`  
> Comunicación interna: **TCP** (ClientProxy.send) + **RabbitMQ** (ClientProxy.emit)  
> Las respuestas exitosas son **passthrough** del microservicio correspondiente.

---

## Formatos de Respuesta por Microservicio

Cada microservicio envuelve sus respuestas de forma diferente. El gateway hace passthrough directo.

### Users MS (TCP)

Devuelve directamente el objeto/array sin wrapper.

### Content MS (RabbitMQ)

Todas las respuestas vienen envueltas en:

````markdown
# Client Gateway — Endpoints Completos

> Prefijo global: `/api`  
> Comunicación interna: **TCP** (ClientProxy.send) + **RabbitMQ** (ClientProxy.emit)  
> Las respuestas exitosas son **passthrough** del microservicio correspondiente.

---

## Formatos de Respuesta por Microservicio

Cada microservicio envuelve sus respuestas de forma diferente. El gateway hace passthrough directo.

### Users MS (TCP)

Devuelve directamente el objeto/array sin wrapper.

### Content MS (RabbitMQ)

Todas las respuestas vienen envueltas en:

```json
{ "success": true, "data": { ... }, "message": "Operation successful" }
```
````

Con paginación:

```json
{
  "success": true,
  "data": {
    "data": [...],
    "meta": { "total": 100, "page": 1, "lastPage": 5, "limit": 20 }
  },
  "message": "Operation successful"
}
```

### Notifications MS (RabbitMQ)

Respuestas envueltas en:

```json
{ "statusCode": 200, "message": "Descripción", "data": { ... } }
```

Con paginación:

```json
{
  "statusCode": 200,
  "message": "Descripción",
  "data": [...],
  "meta": { "total": 50, "page": 1, "limit": 20, "totalPages": 3 }
}
```

### Formato de Errores (todos los MS)

```json
{ "statusCode": 404, "code": "NOT_FOUND", "message": "Recurso no encontrado" }
```

El gateway los transforma a:

```json
{ "code": "NOT_FOUND", "message": "Recurso no encontrado", "details": {} }
```

Códigos de error: `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_SERVER_ERROR`.

---

## Usuarios (`/api/users`) → Users MS (TCP)

| Método   | Ruta                    | MessagePattern   | Payload enviado al MS                                     | Respuesta del MS                                                                              |
| -------- | ----------------------- | ---------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `POST`   | `/users`                | `createUser`     | `{ name, email, password, googleId?, biography?, role? }` | Objeto `User` (`id`, `name`, `email`, `googleId`, `biography`, `role`, `status`, `createdAt`) |
| `GET`    | `/users`                | `findAllUsers`   | `{}`                                                      | Array de `User` (solo `status: true`)                                                         |
| `GET`    | `/users/:id`            | `findOneUser`    | `id` (UUID string)                                        | Objeto `User`                                                                                 |
| `PATCH`  | `/users/:id`            | `updateUser`     | `{ id, ...campos parciales }`                             | Objeto `User` actualizado                                                                     |
| `DELETE` | `/users/:id`            | `removeUser`     | `id` (UUID string)                                        | Objeto `User` eliminado                                                                       |
| `PATCH`  | `/users/:id/deactivate` | `deactivateUser` | `id` (UUID string)                                        | `{ "message": "Account deactivated succesfully" }`                                            |
| `PATCH`  | `/users/:id/password`   | `addPassword`    | `{ id, newPassword }`                                     | Objeto `User` actualizado                                                                     |

> `deactivateUser` emite evento RMQ `user.deactivated` → `{ userId }`.  
> `addPassword` retorna error `400` si el usuario ya tiene contraseña.

### DTO: CreateUserDto

| Campo       | Tipo       | Requerido            | Validadores                                   |
| ----------- | ---------- | -------------------- | --------------------------------------------- |
| `name`      | `string`   | Sí                   | `@IsString()` `@IsNotEmpty()`                 |
| `email`     | `string`   | Sí                   | `@IsString()`                                 |
| `password`  | `string`   | Sí                   | `@IsString()` `@IsNotEmpty()`                 |
| `googleId`  | `string`   | No                   | `@IsString()` `@IsOptional()`                 |
| `biography` | `string`   | No                   | `@IsString()` `@IsOptional()`                 |
| `role`      | `UserRole` | No (default: `USER`) | `@IsOptional()` `@IsEnum(['USER', 'ARTIST'])` |

### DTO: UpdateUserDto

Extiende `PartialType(CreateUserDto)` — todos los campos son opcionales.

---

## Seguimientos (`/api/user-follows`) → Users MS (TCP)

| Método | Ruta                                    | MessagePattern       | Payload enviado al MS        | Respuesta del MS                                                                                                           |
| ------ | --------------------------------------- | -------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/user-follows`                         | `toggleUserFollow`   | `{ followerId, followedId }` | `{ following: true, message: "Ahora se sigue al usuario {id}" }` o `{ following: false, message: "Se dejo de seguir..." }` |
| `GET`  | `/user-follows/:followerId`             | `findAllUserFollows` | `followerId` (string)        | Array de `UserFollows` (`followerId`, `followedId`, `createdAt`)                                                           |
| `GET`  | `/user-follows/:followerId/:followedId` | `findOneUserFollow`  | `{ followerId, followedId }` | Objeto `UserFollows` o `null`                                                                                              |
| `GET`  | `/user-follows/followers/:userId`       | `findFollowers`      | `{ userId }`                 | `string[]` — Array de UUIDs de seguidores                                                                                  |

> `toggleUserFollow` emite eventos RMQ: `follow.created` o `follow.removed`.  
> Error `400` si `followerId === followedId`.

### DTO: CreateUFDto

| Campo        | Tipo     | Requerido | Validadores   |
| ------------ | -------- | --------- | ------------- |
| `followerId` | `string` | Sí        | `@IsString()` |
| `followedId` | `string` | Sí        | `@IsString()` |

---

## Estadísticas de Usuario (`/api/user-stats`) → Users MS (TCP)

| Método  | Ruta                           | MessagePattern          | Payload enviado al MS | Respuesta del MS                                   |
| ------- | ------------------------------ | ----------------------- | --------------------- | -------------------------------------------------- |
| `GET`   | `/user-stats/:sqlUserId`       | `findUserStats`         | `sqlUserId` (string)  | `{ _id, sqlUserId, profileViews, createdAt }`      |
| `PATCH` | `/user-stats/:sqlUserId/views` | `incrementProfileViews` | `sqlUserId` (string)  | Objeto `UserStats` con `profileViews` incrementado |

---

## Redes Sociales (`/api/social-media`) → Users MS (TCP)

| Método   | Ruta                | MessagePattern       | Payload enviado al MS         | Respuesta del MS                                          |
| -------- | ------------------- | -------------------- | ----------------------------- | --------------------------------------------------------- |
| `POST`   | `/social-media`     | `createSocialMedia`  | `{ userId, url }`             | Objeto `SocialMedia` (`id`, `userId`, `url`, `createdAt`) |
| `GET`    | `/social-media`     | `findAllSocialMedia` | `{}`                          | Array de `SocialMedia`                                    |
| `GET`    | `/social-media/:id` | `findOneSocialMedia` | `id` (UUID string)            | Objeto `SocialMedia`                                      |
| `PATCH`  | `/social-media/:id` | `updateSocialMedia`  | `{ id, ...campos parciales }` | Objeto `SocialMedia` actualizado                          |
| `DELETE` | `/social-media/:id` | `removeSocialMedia`  | `id` (UUID string)            | Objeto `SocialMedia` eliminado                            |

### DTO: CreateSMDto

| Campo    | Tipo     | Requerido | Validadores                   |
| -------- | -------- | --------- | ----------------------------- |
| `userId` | `string` | Sí        | `@IsString()` `@IsNotEmpty()` |
| `url`    | `string` | Sí        | `@IsString()` `@IsNotEmpty()` |

---

## Restablecimiento de Contraseña (`/api/password-resets`) → Users MS (TCP)

| Método   | Ruta                     | MessagePattern                                     | Payload enviado al MS                 | Respuesta del MS                                        |
| -------- | ------------------------ | -------------------------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| `POST`   | `/password-resets/send`  | `sendPasswordReset` → Users MS                     | `{ mail }`                            | `{ "message": "Password reset email sent" }` (HTTP 200) |
|          |                          | `send.resetPassword` → Notifications MS (emit RMQ) | `{ mail, userId, userName, token }`   | — (evento, sin respuesta)                               |
| `POST`   | `/password-resets`       | `createPasswordReset`                              | `{ userId, token, expiresAt, used? }` | Objeto password reset creado                            |
| `GET`    | `/password-resets`       | `findAllPasswordResets`                            | `{}`                                  | Array de password resets                                |
| `GET`    | `/password-resets/:id`   | `findOnePasswordReset`                             | `id` (string)                         | Objeto password reset                                   |
| `PATCH`  | `/password-resets/reset` | `updatePasswordReset`                              | `{ token, password }`                 | Objeto actualizado (reset de contraseña por token)      |
| `PATCH`  | `/password-resets/:id`   | `updatePasswordReset`                              | `{ id, ...campos de CreatePRDto }`    | Objeto actualizado (CRUD genérico)                      |
| `DELETE` | `/password-resets/:id`   | `removePasswordReset`                              | `id` (string)                         | Confirmación                                            |

> `PATCH /password-resets/reset` envía `{ token, password }` al MS para resetear la contraseña usando el token del email.  
> `PATCH /password-resets/:id` mantiene el CRUD genérico con `{ id, ...CreatePRDto }`.

### DTO: ResetPasswordDto

| Campo      | Tipo     | Requerido | Validadores                   |
| ---------- | -------- | --------- | ----------------------------- |
| `token`    | `string` | Sí        | `@IsString()` `@IsNotEmpty()` |
| `password` | `string` | Sí        | `@IsString()` `@IsNotEmpty()` |

### DTO: CreatePRDto

| Campo       | Tipo      | Requerido | Validadores                       |
| ----------- | --------- | --------- | --------------------------------- |
| `userId`    | `string`  | Sí        | `@IsString()` `@IsNotEmpty()`     |
| `token`     | `string`  | Sí        | `@IsString()` `@IsNotEmpty()`     |
| `expiresAt` | `string`  | Sí        | `@IsDateString()` `@IsNotEmpty()` |
| `used`      | `boolean` | No        | `@IsBoolean()` `@IsOptional()`    |

### DTO: MailDto

| Campo  | Tipo     | Requerido | Validadores                                |
| ------ | -------- | --------- | ------------------------------------------ |
| `mail` | `string` | Sí        | `@IsString()` `@IsNotEmpty()` `@IsEmail()` |

---

## Autenticación (`/api/auth`) → Users MS (TCP) + Content MS (RMQ)

| Método | Ruta                    | MessagePattern                            | Payload enviado al MS                                   | Respuesta del MS                                     |
| ------ | ----------------------- | ----------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| `GET`  | `/auth/google`          | —                                         | —                                                       | Redirige a Google OAuth (guard)                      |
| `GET`  | `/auth/google/callback` | `findUserByEmail` → Users MS              | `{ email }`                                             | Objeto `User` o `null`                               |
|        |                         | `createUserGoogle` → Users MS             | `{ name, email, googleId, password: '', role: 'USER' }` | Objeto `User` creado                                 |
|        |                         | `generateToken` → Users MS                | `{ id, email, role }`                                   | `string` (JWT, expira 24h)                           |
|        |                         | `auth.tokenGenerated` → Content MS (emit) | `{ user, token }`                                       | — (evento ECST)                                      |
|        |                         | **Resultado final**                       | —                                                       | Redirect a `http://localhost:3000/home?token=...`    |
| `GET`  | `/auth/logout`          | —                                         | —                                                       | `{ message: "Sesión cerrada exitosamente" }` o error |
| `POST` | `/auth/login`           | `login` → Users MS                        | `{ email, password }`                                   | `{ token, user: { id, name, email, role, ... } }`    |
|        |                         | `auth.tokenGenerated` → Content MS (emit) | `{ user, token }`                                       | — (evento ECST)                                      |

> `login` puede retornar `401` (credenciales inválidas) o `400` (cuenta de Google sin contraseña).  
> `auth.tokenGenerated` es necesario para el ECST — el content MS replica la referencia del usuario.

---

## Publicaciones (`/api/posts`) → Content MS (RMQ)

| Método   | Ruta         | MessagePattern | Payload enviado al MS                                             | Respuesta del MS                                     |
| -------- | ------------ | -------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `POST`   | `/posts`     | `createPost`   | `{ sql_user_id, type, title, content?, description?, provider? }` | `{ success, data: Post, message }`                   |
| `GET`    | `/posts`     | `findAllPosts` | `{ page?, limit? }` (query params)                                | `{ success, data: { data: Post[], meta }, message }` |
| `GET`    | `/posts/:id` | `findOnePost`  | `id` (string)                                                     | `{ success, data: Post, message }`                   |
| `PATCH`  | `/posts/:id` | `updatePost`   | `{ id, ...campos parciales }`                                     | `{ success, data: Post, message }`                   |
| `DELETE` | `/posts/:id` | `removePost`   | `id` (string)                                                     | `{ success, data: Post, message }`                   |

> El MS soporta paginación con defaults (page=1, limit=20). El gateway envía los query params `page` y `limit` si se proporcionan.

### DTO: CreatePostDto

| Campo         | Tipo                 | Requerido | Validadores                               |
| ------------- | -------------------- | --------- | ----------------------------------------- |
| `sql_user_id` | `string`             | Sí        | `@IsString()` `@IsNotEmpty()`             |
| `type`        | `'image' \| 'audio'` | Sí        | `@IsString()` `@IsIn(['image', 'audio'])` |
| `title`       | `string`             | Sí        | `@IsString()` `@IsNotEmpty()`             |
| `url`         | `string`             | No        | `@IsOptional()` `@IsUrl()` `@IsString()`  |
| `description` | `string`             | No        | `@IsString()` `@IsOptional()`             |
| `provider`    | `string`             | No        | `@IsOptional()` `@IsString()`             |

---

## Reacciones a Posts (`/api/posts/reactions`) → Content MS (RMQ)

| Método   | Ruta                            | MessagePattern        | Payload enviado al MS            | Respuesta del MS                         |
| -------- | ------------------------------- | --------------------- | -------------------------------- | ---------------------------------------- |
| `POST`   | `/posts/reactions`              | `createPostReaction`  | `{ sql_user_id, post_id, type }` | `{ success, data: Reaction, message }`   |
| `GET`    | `/posts/reactions/post/:postId` | `findReactionsByPost` | `{ post_id: postId }`            | `{ success, data: Reaction[], message }` |
| `DELETE` | `/posts/reactions/:id`          | `removePostReaction`  | `id` (string)                    | `{ success, data, message }`             |

### DTO: CreatePostReactionsDto

| Campo         | Tipo     | Requerido | Validadores                                                              |
| ------------- | -------- | --------- | ------------------------------------------------------------------------ |
| `sql_user_id` | `string` | Sí        | `@IsString()` `@IsNotEmpty()`                                            |
| `post_id`     | `string` | Sí        | `@IsString()` `@IsNotEmpty()`                                            |
| `type`        | `string` | Sí        | `@IsString()` `@IsNotEmpty()` `@IsIn(['like','love','fire','applause'])` |

---

## Posts Guardados (`/api/posts/saved`) → Content MS (RMQ)

| Método   | Ruta                           | MessagePattern         | Payload enviado al MS        | Respuesta del MS                          |
| -------- | ------------------------------ | ---------------------- | ---------------------------- | ----------------------------------------- |
| `POST`   | `/posts/saved`                 | `createSavedPost`      | `{ post_id, sql_user_id }`   | `{ success, data: SavedPost, message }`   |
| `GET`    | `/posts/saved`                 | `findAllSavedPosts`    | `{}`                         | `{ success, data: SavedPost[], message }` |
| `GET`    | `/posts/saved/user/:sqlUserId` | `findSavedPostsByUser` | `{ sql_user_id: sqlUserId }` | `{ success, data: SavedPost[], message }` |
| `DELETE` | `/posts/saved/:id`             | `removeSavedPost`      | `id` (string)                | `{ success, data, message }`              |

### DTO: CreateSavedPostDto

| Campo         | Tipo     | Requerido | Validadores                                  |
| ------------- | -------- | --------- | -------------------------------------------- |
| `post_id`     | `string` | Sí        | `@IsString()` `@IsNotEmpty()` `@IsMongoId()` |
| `sql_user_id` | `string` | Sí        | `@IsString()` `@IsNotEmpty()`                |

---

## Eventos (`/api/events`) → Content MS (RMQ) + Users MS (TCP)

| Método   | Ruta          | MessagePattern             | Payload enviado al MS                                                   | Respuesta del MS                                      |
| -------- | ------------- | -------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| `POST`   | `/events`     | `findFollowers` → Users MS | `{ userId: sql_user_id }`                                               | `string[]` (interno)                                  |
|          |               | `createEvent` → Content MS | `{ sql_user_id, title, description?, event_date, location, followers }` | `{ success, data: Event, message }`                   |
| `GET`    | `/events`     | `findAllEvents`            | `{ page?, limit? }` (query params)                                      | `{ success, data: { data: Event[], meta }, message }` |
| `GET`    | `/events/:id` | `findOneEvent`             | `id` (string)                                                           | `{ success, data: Event, message }`                   |
| `PATCH`  | `/events/:id` | `updateEvent`              | `{ id, ...campos parciales, followers? }`                               | `{ success, data: Event, message }`                   |
| `DELETE` | `/events/:id` | `removeEvent`              | `{ id, followers? }`                                                    | `{ success, data, message }`                          |

> El MS soporta paginación con defaults (page=1, limit=20). El gateway envía los query params `page` y `limit` si se proporcionan.  
> En POST/PATCH/DELETE: si se incluye `sql_user_id` en body, el gateway busca los followers automáticamente para notificaciones.

### DTO: CreateEventDto

| Campo         | Tipo       | Requerido | Validadores                   |
| ------------- | ---------- | --------- | ----------------------------- |
| `sql_user_id` | `string`   | Sí        | `@IsString()` `@IsNotEmpty()` |
| `title`       | `string`   | Sí        | `@IsString()`                 |
| `description` | `string`   | No        | `@IsString()` `@IsOptional()` |
| `event_date`  | `string`   | Sí        | `@IsString()` `@IsNotEmpty()` |
| `location`    | `string`   | Sí        | `@IsString()` `@IsNotEmpty()` |
| `followers`   | `string[]` | No        | `@IsArray()` `@IsOptional()`  |

---

## Asistencia a Eventos (`/api/events/attendance`) → Content MS (RMQ)

| Método   | Ruta                                | MessagePattern            | Payload enviado al MS                | Respuesta del MS                           |
| -------- | ----------------------------------- | ------------------------- | ------------------------------------ | ------------------------------------------ |
| `POST`   | `/events/attendance`                | `createEventAttendance`   | `{ event_id, sql_user_id, status? }` | `{ success, data: Attendance, message }`   |
| `GET`    | `/events/attendance`                | `findAllEventAttendances` | `{}`                                 | `{ success, data: Attendance[], message }` |
| `GET`    | `/events/attendance/event/:eventId` | `findAttendanceByEvent`   | `{ event_id: eventId }`              | `{ success, data: Attendance[], message }` |
| `GET`    | `/events/attendance/:id`            | `findOneEventAttendance`  | `id` (string)                        | `{ success, data: Attendance, message }`   |
| `PATCH`  | `/events/attendance/:id`            | `updateEventAttendance`   | `{ id, ...campos parciales }`        | `{ success, data: Attendance, message }`   |
| `DELETE` | `/events/attendance/:id`            | `removeEventAttendance`   | `id` (string)                        | `{ success, data, message }`               |

### DTO: CreateEventAttendanceDto

| Campo         | Tipo     | Requerido | Validadores                                                                |
| ------------- | -------- | --------- | -------------------------------------------------------------------------- |
| `event_id`    | `string` | Sí        | `@IsString()` `@IsNotEmpty()`                                              |
| `sql_user_id` | `string` | Sí        | `@IsString()` `@IsNotEmpty()`                                              |
| `status`      | `string` | No        | `@IsString()` `@IsOptional()` `@IsIn(['confirmed','pending','cancelled'])` |

---

## Reseñas de Eventos (`/api/events/reviews`) → Content MS (RMQ)

| Método   | Ruta                             | MessagePattern        | Payload enviado al MS               | Respuesta del MS                       |
| -------- | -------------------------------- | --------------------- | ----------------------------------- | -------------------------------------- |
| `POST`   | `/events/reviews`                | `createEventReview`   | `{ event_id, sql_user_id, rating }` | `{ success, data: Review, message }`   |
| `GET`    | `/events/reviews`                | `findAllEventReviews` | `{}`                                | `{ success, data: Review[], message }` |
| `GET`    | `/events/reviews/event/:eventId` | `findReviewsByEvent`  | `{ event_id: eventId }`             | `{ success, data: Review[], message }` |
| `GET`    | `/events/reviews/:id`            | `findOneEventReview`  | `id` (string)                       | `{ success, data: Review, message }`   |
| `PATCH`  | `/events/reviews/:id`            | `updateEventReview`   | `{ id, ...campos parciales }`       | `{ success, data: Review, message }`   |
| `DELETE` | `/events/reviews/:id`            | `removeEventReview`   | `id` (string)                       | `{ success, data, message }`           |

### DTO: CreateEventReviewsDto

| Campo         | Tipo     | Requerido | Validadores                   |
| ------------- | -------- | --------- | ----------------------------- |
| `event_id`    | `string` | Sí        | `@IsString()` `@IsNotEmpty()` |
| `sql_user_id` | `string` | Sí        | `@IsString()` `@IsNotEmpty()` |
| `rating`      | `number` | Sí        | `@IsNumber()` `@IsNotEmpty()` |

---

## Notificaciones (`/api/notifications`) → Notifications MS (RMQ)

| Método   | Ruta                                  | MessagePattern            | Payload enviado al MS                               | Respuesta del MS                                           |
| -------- | ------------------------------------- | ------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `POST`   | `/notifications`                      | `createNotification`      | `{ userIdReceiver, type, message }`                 | `{ statusCode: 201, message, data: Notification }`         |
| `GET`    | `/notifications`                      | `findAllNotifications`    | `{ page?, limit? }` (query params)                  | `{ statusCode: 200, message, data: Notification[], meta }` |
| `GET`    | `/notifications/user/:userIdReceiver` | `findNotificationsByUser` | `{ userIdReceiver, pagination: { page?, limit? } }` | `{ statusCode: 200, message, data: Notification[], meta }` |
| `GET`    | `/notifications/:id`                  | `findOneNotification`     | `id` (string)                                       | `{ statusCode: 200, message, data: Notification }`         |
| `PATCH`  | `/notifications/:id`                  | `updateNotification`      | `{ id, ...UpdateNotificationDto }`                  | `{ statusCode: 200, message, data: Notification }`         |
| `DELETE` | `/notifications/:id`                  | `removeNotification`      | `id` (string)                                       | `{ statusCode: 200, message }`                             |

> **⚠️ Sin paginación:** El MS soporta `{ page, limit }` en `findAllNotifications` y `findNotificationsByUser`, pero el gateway no los envía.  
> **⚠️ Falta endpoint:** El MS soporta `updateNotification`, pero el gateway no tiene `PATCH /notifications/:id`.  
> **⚠️ Payload diferente:** El MS espera `{ userIdReceiver, pagination: { page, limit } }` para `findNotificationsByUser`, pero el gateway envía solo el string `userIdReceiver`.

### DTO: CreateNotificationDto

| Campo            | Tipo               | Requerido | Validadores                   |
| ---------------- | ------------------ | --------- | ----------------------------- |
| `userIdReceiver` | `string`           | Sí        | `@IsString()` `@IsNotEmpty()` |
| `type`           | `NotificationType` | Sí        | `@IsEnum(NotificationType)`   |
| `message`        | `string`           | Sí        | `@IsString()` `@IsNotEmpty()` |

### Enum: NotificationType

| Valor             |
| ----------------- |
| `EVENT_REMINDER`  |
| `EVENT_UPDATE`    |
| `EVENT_CANCELLED` |
| `NEW_EVENT`       |

---

## Eventos RabbitMQ emitidos

Eventos que el gateway emite o que los MS emiten internamente.

### Emitidos por el Gateway

| Evento                | Destino          | Payload                             | Cuándo                  |
| --------------------- | ---------------- | ----------------------------------- | ----------------------- |
| `auth.tokenGenerated` | Content MS       | `{ user, token }`                   | Login y Google callback |
| `send.resetPassword`  | Notifications MS | `{ mail, userId, userName, token }` | Password reset send     |

### Emitidos por los Microservicios (internos)

| Evento             | Emisor     | Payload                                                       |
| ------------------ | ---------- | ------------------------------------------------------------- |
| `user.deactivated` | Users MS   | `{ userId }`                                                  |
| `follow.created`   | Users MS   | `{ follower_id, follower_email, follower_name, followed_id }` |
| `follow.removed`   | Users MS   | `{ follower_id, followed_id }`                                |
| `post.created`     | Content MS | `{ type, message, userId, postId? }`                          |
| `event.created`    | Content MS | `{ type, message, userId, eventId? }`                         |
| `event.updated`    | Content MS | `{ type, message, userId, eventId? }`                         |
| `event.cancelled`  | Content MS | `{ type, message, userId, eventId? }`                         |

---

## Discrepancias Corregidas

Todas las discrepancias detectadas durante la validación cruzada con los MS han sido corregidas:

| #   | Problema original                                | Corrección aplicada                                                                                                                             |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Paginación no implementada**                   | Se agregó `PaginationDto` (query params `page`, `limit`) a `findAllPosts`, `findAllEvents`, `findAllNotifications` y `findNotificationsByUser`. |
| 2   | **`updateNotification` faltante**                | Se agregó `PATCH /notifications/:id` con `UpdateNotificationDto`.                                                                               |
| 3   | **`findNotificationsByUser` payload incorrecto** | Ahora envía `{ userIdReceiver, pagination: { page, limit } }` al MS.                                                                            |
| 4   | **`updatePasswordReset` payload incompatible**   | Se agregó `PATCH /password-resets/reset` con `ResetPasswordDto` (`{ token, password }`).                                                        |
| 5   | **PostReactions `type` sin validación**          | Se agregó `@IsIn(['like','love','fire','applause'])` al DTO.                                                                                    |
| 6   | **EventAttendance `status` sin validación**      | Se agregó `@IsIn(['confirmed','pending','cancelled'])` al DTO.                                                                                  |

---

## Guía de pruebas (Postman)

Se añadió una guía paso a paso para ejecutar el flujo E2E (registro → login → crear post) en Postman. Ver: [POSTMAN_FLOW.md](POSTMAN_FLOW.md)

Notas:

- Si `POST /posts` falla con `500` y la traza contiene `unable to get local issuer certificate`, revisa la imagen `content-ms` (instalar `ca-certificates` o usar `NODE_EXTRA_CA_CERTS`).
- Si el `content-ms` falla con `Cannot find module 'undici'`, sincroniza `package-lock.json` y asegúrate de que `undici` está en `dependencies` antes de `npm ci` en la imagen.

```

```
