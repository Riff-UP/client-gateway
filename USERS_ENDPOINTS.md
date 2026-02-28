# Users Microservice — Gateway Endpoints

> Comunicación vía **TCP + RabbitMQ** (MessagePattern).
> Rutas REST expuestas por el API Gateway (`client-gateway`).

---

## Users

| Método   | Ruta                    | MessagePattern     | Body                                                                                                                                                                                      |
| -------- | ----------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/users`                | `createUser`       | `{ "name": "string (req)", "email": "string (req)", "password": "string (req)", "googleId": "string (opt)", "biography": "string (opt)", "role": "USER \| ARTIST (opt, default: USER)" }` |
| `GET`    | `/users`                | `findAllUsers`     | —                                                                                                                                                                                         |
| `GET`    | `/users/:id`            | `findOneUser`      | —                                                                                                                                                                                         |
| `PATCH`  | `/users/:id`            | `updateUser`       | `{ "name": "string (opt)", "email": "string (opt)", "password": "string (opt)", "googleId": "string (opt)", "biography": "string (opt)", "role": "USER \| ARTIST (opt)" }`                |
| `DELETE` | `/users/:id`            | `removeUser`       | —                                                                                                                                                                                         |
| `POST`   | `/users/find-by-email`  | `findUserByEmail`  | `{ "email": "string (req)" }`                                                                                                                                                             |
| `POST`   | `/users/generate-token` | `generateToken`    | `{ "user": "object (req)" }`                                                                                                                                                              |
| `POST`   | `/users/google`         | `createUserGoogle` | `{ "payload": "object (req)" }`                                                                                                                                                           |
| `POST`   | `/users/login`          | `login`            | `{ "email": "string (req)", "password": "string (req)" }`                                                                                                                                 |

---

## Social Media

| Método   | Ruta                | MessagePattern       | Body                                                  |
| -------- | ------------------- | -------------------- | ----------------------------------------------------- |
| `POST`   | `/social-media`     | `createSocialMedia`  | `{ "userId": "string (req)", "url": "string (req)" }` |
| `GET`    | `/social-media`     | `findAllSocialMedia` | —                                                     |
| `GET`    | `/social-media/:id` | `findOneSocialMedia` | —                                                     |
| `PATCH`  | `/social-media/:id` | `updateSocialMedia`  | `{ "userId": "string (opt)", "url": "string (opt)" }` |
| `DELETE` | `/social-media/:id` | `removeSocialMedia`  | —                                                     |

---

## User Follows

| Método | Ruta                                    | MessagePattern       | Body                                                             |
| ------ | --------------------------------------- | -------------------- | ---------------------------------------------------------------- |
| `POST` | `/user-follows`                         | `toggleUserFollow`   | `{ "followerId": "string (req)", "followedId": "string (req)" }` |
| `GET`  | `/user-follows/:followerId`             | `findAllUserFollows` | —                                                                |
| `GET`  | `/user-follows/:followerId/:followedId` | `findOneUserFollow`  | —                                                                |

---

## User Stats

| Método  | Ruta                           | MessagePattern          | Body |
| ------- | ------------------------------ | ----------------------- | ---- |
| `GET`   | `/user-stats/:sqlUserId`       | `findUserStats`         | —    |
| `PATCH` | `/user-stats/:sqlUserId/views` | `incrementProfileViews` | —    |

---

## Password Resets

| Método   | Ruta                    | MessagePattern                  | Body                                                                                                                   |
| -------- | ----------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/password-resets`      | `createPasswordReset`           | `{ "userId": "string (req)", "token": "string (req)", "expiresAt": "ISO date string (req)", "used": "boolean (opt)" }` |
| `GET`    | `/password-resets`      | `findAllPasswordResets`         | —                                                                                                                      |
| `GET`    | `/password-resets/:id`  | `findOnePasswordReset`          | —                                                                                                                      |
| `PATCH`  | `/password-resets/:id`  | `updatePasswordReset`           | `{ "userId": "string (opt)", "token": "string (opt)", "expiresAt": "ISO date string (opt)", "used": "boolean (opt)" }` |
| `DELETE` | `/password-resets/:id`  | `removePasswordReset`           | —                                                                                                                      |
| `POST`   | `/password-resets/send` | `send.resetPassword` (emit RMQ) | `{ "mail": "string email (req)" }`                                                                                     |
