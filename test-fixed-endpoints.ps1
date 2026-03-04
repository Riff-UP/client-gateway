# Script de Prueba - Endpoints /users/me y /users/artists (CORREGIDOS)
# Ejecutar: .\test-fixed-endpoints.ps1

$baseUrl = "http://localhost:4000/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test de Endpoints Corregidos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Verificar /users/artists (debe funcionar SIN error 500)
Write-Host "[Test 1/3] Verificando endpoint /users/artists..." -ForegroundColor Yellow
try {
    $artists = Invoke-RestMethod -Uri "$baseUrl/users/artists" -Method GET -ErrorAction Stop
    Write-Host "✅ Endpoint /users/artists funciona correctamente" -ForegroundColor Green
    Write-Host "   Total artistas encontrados: $($artists.Count)" -ForegroundColor Gray
    if ($artists.Count -gt 0) {
        Write-Host "   Primeros artistas:" -ForegroundColor Gray
        $artists | Select-Object -First 3 | ForEach-Object {
            Write-Host "   🎵 $($_.name) - $($_.email) (Role: $($_.role))" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  No hay artistas registrados aún" -ForegroundColor Yellow
        Write-Host "   Crea un usuario con role='ARTIST' para verlo aquí" -ForegroundColor Yellow
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 500) {
        Write-Host "❌ ERROR 500: El microservicio de usuarios no responde correctamente" -ForegroundColor Red
        Write-Host "   Verifica que el microservicio esté corriendo:" -ForegroundColor Yellow
        Write-Host "   docker logs riff_users_ms" -ForegroundColor Gray
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 2: Probar paginación
Write-Host "[Test 2/3] Probando paginación en /users/artists..." -ForegroundColor Yellow
try {
    $page1 = Invoke-RestMethod -Uri "$baseUrl/users/artists?limit=2&offset=0" -Method GET -ErrorAction Stop
    Write-Host "✅ Paginación funciona correctamente" -ForegroundColor Green
    Write-Host "   Página 1 (limit=2, offset=0): $($page1.Count) artistas" -ForegroundColor Gray

    if ($page1.Count -gt 0) {
        $page2 = Invoke-RestMethod -Uri "$baseUrl/users/artists?limit=2&offset=2" -Method GET -ErrorAction Stop
        Write-Host "   Página 2 (limit=2, offset=2): $($page2.Count) artistas" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error en paginación: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Verificar /users/me (debe retornar 401 sin sesión)
Write-Host "[Test 3/3] Verificando /users/me (sin autenticación)..." -ForegroundColor Yellow
try {
    $me = Invoke-RestMethod -Uri "$baseUrl/users/me" -Method GET -ErrorAction Stop
    Write-Host "✅ Endpoint /users/me funciona" -ForegroundColor Green
    Write-Host "   Usuario autenticado: $($me.name) ($($me.email))" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Endpoint /users/me funciona correctamente (retorna 401 sin sesión)" -ForegroundColor Green
        Write-Host "   Esto es el comportamiento esperado" -ForegroundColor Gray
    } elseif ($_.Exception.Response.StatusCode -eq 500) {
        Write-Host "❌ ERROR 500: Algo falló en el servidor" -ForegroundColor Red
        Write-Host "   Verifica los logs del gateway:" -ForegroundColor Yellow
        Write-Host "   docker logs riff_client_gateway" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Respuesta inesperada: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Si /users/artists funciona: El problema está resuelto" -ForegroundColor Green
Write-Host "✅ Si /users/me retorna 401: Es el comportamiento correcto sin sesión" -ForegroundColor Green
Write-Host ""
Write-Host "❌ Si aún ves errores 500:" -ForegroundColor Red
Write-Host "   1. Reinicia el gateway: docker compose restart client-gateway" -ForegroundColor Yellow
Write-Host "   2. Verifica los logs: docker logs -f riff_client_gateway" -ForegroundColor Yellow
Write-Host "   3. Verifica que el microservicio de usuarios esté corriendo" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Siguiente paso" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si ves URLs como '/users/artists:1' en tu frontend:" -ForegroundColor Yellow
Write-Host "  → Ese es un error en el código del frontend" -ForegroundColor Yellow
Write-Host "  → Busca donde construyes las URLs de las peticiones HTTP" -ForegroundColor Yellow
Write-Host "  → Cambia ':1' por '?page=1' o elimina ese parámetro" -ForegroundColor Yellow
Write-Host ""

