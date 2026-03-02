<#
Apply Docker daemon DNS config and restart Docker Desktop.
Run this script as Administrator.

What it does:
- Copies docker-daemon.example.json to C:\ProgramData\Docker\config\daemon.json
- Restarts Docker service (com.docker.service) and waits for Docker to become available
- Recreates compose services using existing helper script

Usage (run as Admin):
  pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\apply_daemon_and_restart.ps1
#>

Set-StrictMode -Version Latest
function Is-Admin {
  $current = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($current)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Is-Admin)) {
  Write-Error "This script must be run as Administrator. Open an elevated PowerShell and run it again."
  exit 1
}

$source = Join-Path -Path (Get-Location) -ChildPath 'docker-daemon.example.json'
$destDir = 'C:\ProgramData\Docker\config'
$dest = Join-Path -Path $destDir -ChildPath 'daemon.json'

if (-not (Test-Path $source)) {
  Write-Error "Source file not found: $source"
  exit 1
}

if (-not (Test-Path $destDir)) {
  New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

Copy-Item -Path $source -Destination $dest -Force
Write-Host "Copied $source -> $dest"

Write-Host "Restarting Docker service..."
try {
  Restart-Service -Name 'com.docker.service' -Force -ErrorAction Stop
} catch {
  Write-Warning "Failed to restart 'com.docker.service' automatically. You may need to restart Docker Desktop manually. $_"
}

Write-Host "Waiting for Docker to become available..."
for ($i=0; $i -lt 60; $i++) {
  try {
    docker version > $null 2>&1
    Write-Host "Docker is available."
    break
  } catch {
    Start-Sleep -Seconds 2
  }
}

Write-Host "Recreating compose services to apply changes..."
./scripts/recreate_services.ps1

Write-Host "Done. Verify with: docker exec riff_content_ms sh -c 'cat /etc/resolv.conf'"
