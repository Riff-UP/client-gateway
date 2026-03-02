#!/usr/bin/env pwsh
<#
Recreate docker compose services to pick up DNS overrides.
Usage: From repository root run: ./scripts/recreate_services.ps1
#>
Set-StrictMode -Version Latest
Write-Host "Recreating docker compose services (no build, force recreate)..."
# If you have a multi-file compose setup, include all compose files you use.
docker compose up -d --no-build --force-recreate --remove-orphans
Write-Host "Done. Check logs with: docker logs -f <service>"
