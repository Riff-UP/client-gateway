import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO para crear un evento en el microservicio de contenido
 *
 * ⚠️ REQUISITO: Replicación de Usuarios (ECST Pattern)
 *
 * El microservicio de contenido valida que el usuario (sql_user_id) exista en su
 * base de datos local. El usuario debe estar replicado mediante el evento
 * 'auth.tokenGenerated' emitido por users-ms vía RabbitMQ.
 *
 * ESTRUCTURA DEL EVENTO ESPERADO:
 * ```
 * pattern: 'auth.tokenGenerated'
 * data: {
 *   userId: '13de4750-500d-4912-8178-388dabcbc962',
 *   email: 'user@example.com',
 *   role: 'USER',
 *   timestamp: '2026-03-05T08:48:38.000Z'
 * }
 * ```
 *
 * SI OBTIENES ERROR "Usuario no encontrado en la base de datos local":
 * - Verifica que users-ms emita el evento al autenticar
 * - Verifica que content-ms escuche el evento
 * - Verifica usuario en MongoDB: `db.users.find({ sql_user_id: 'xxx' })`
 *
 * Docs: FIX-USER-REPLICATION-ECST.md, VERIFICACION-AUTH-TOKEN-GENERATED.md
 */
export class CreateEventDto {
  @IsString()
  @IsOptional() // ← Opcional porque el gateway lo agrega desde el JWT
  sql_user_id?: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  event_date!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsArray()
  @IsOptional()
  followers?: string[];
}
