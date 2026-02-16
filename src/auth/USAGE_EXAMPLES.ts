/**
 * EJEMPLO: Cómo usar JWT Authentication en tus controladores
 * 
 * Este archivo muestra diferentes formas de proteger rutas con JWT
 * y obtener información del usuario autenticado.
 */

import { Controller, Get, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';

// Ejemplo 1: Proteger todo un controlador
@Controller('posts')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
export class PostsProtectedController {
  
  @Get()
  findAll(@GetUser() user: any) {
    // El usuario está disponible en todas las rutas
    return {
      message: `Posts del usuario ${user.email}`,
      userId: user.userId,
    };
  }

  @Post()
  create(@Body() createPostDto: any, @GetUser() user: any) {
    return {
      message: 'Post creado',
      author: user.userId,
      email: user.email,
      data: createPostDto,
    };
  }
}

// Ejemplo 2: Proteger rutas individuales
@Controller('comments')
export class CommentsController {
  
  // Ruta pública - no requiere autenticación
  @Get()
  findAll() {
    return {
      message: 'Todos los comentarios (público)',
    };
  }

  // Ruta protegida - requiere autenticación
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: any, @GetUser() user: any) {
    return {
      message: 'Comentario creado',
      author: user.userId,
      data: createCommentDto,
    };
  }

  // Ruta protegida - solo obtener el email
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser('email') email: string) {
    return {
      message: `Comentario ${id} eliminado por ${email}`,
    };
  }
}

// Ejemplo 3: Obtener diferentes propiedades del usuario
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  
  // Obtener el objeto completo del usuario
  @Get()
  getProfile(@GetUser() user: any) {
    return {
      userId: user.userId,
      email: user.email,
      // Otras propiedades que estén en el payload JWT
    };
  }

  // Obtener solo el ID del usuario
  @Get('id')
  getUserId(@GetUser('userId') userId: string) {
    return { userId };
  }

  // Obtener solo el email
  @Get('email')
  getUserEmail(@GetUser('email') email: string) {
    return { email };
  }
}

/**
 * NOTAS IMPORTANTES:
 * 
 * 1. Para usar JwtAuthGuard, el cliente debe enviar el header:
 *    Authorization: Bearer <token>
 * 
 * 2. Si el token es inválido o no se proporciona, se retorna 401 Unauthorized
 * 
 * 3. El decorador @GetUser() extrae la información del usuario del request.user
 *    que fue populado por el JWT strategy después de validar el token
 * 
 * 4. Puedes usar @GetUser('propertyName') para obtener una propiedad específica
 * 
 * 5. Para rutas mixtas (algunas públicas, otras protegidas), aplica el guard
 *    solo a las rutas que lo necesiten, no al controlador completo
 */

// Ejemplo 4: Patrón recomendado para microservicios
@Controller('example')
export class ExampleController {
  
  @Post('action')
  @UseGuards(JwtAuthGuard)
  async performAction(
    @Body() dto: any,
    @GetUser('userId') userId: string,
    @GetUser('email') email: string,
  ) {
    // Aquí podrías hacer una llamada al microservicio
    // pasando el userId para que el microservicio sepa quién hace la acción
    
    return {
      message: 'Acción realizada',
      performedBy: {
        userId,
        email,
      },
      data: dto,
    };
  }
}
