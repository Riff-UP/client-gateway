param(
  [string]$RootPath = 'C:\Users\chinc\Desktop\Developing\Riff\Servicios',
  [string]$NewRabbit = 'amqp://guest:guest@central-rabbit:5672',
  [switch]$ApplyCompose
)

function Backup-File($path) {
  $bak = "$path.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
  Copy-Item -Path $path -Destination $bak -Force
  return $bak
}

Write-Host "Scanning $RootPath for .env and docker-compose.yml files..."

$dirs = Get-ChildItem -Path $RootPath -Directory -ErrorAction SilentlyContinue
if (-not $dirs) { Write-Error "No directories found under $RootPath"; exit 1 }

$updated = @()
foreach ($d in $dirs) {
  $changed = $false
  $envFile = Join-Path $d.FullName '.env'
  $composeFile = Join-Path $d.FullName 'docker-compose.yml'

  if (Test-Path $envFile) {
    Write-Host "Found .env in $($d.Name) -> $envFile"
    $bak = Backup-File $envFile
    Write-Host "Backed up to $bak"
    $content = Get-Content $envFile -Raw
    if ($content -match 'RABBIT_URL=') {
      $newContent = ($content -split "\r?\n") | ForEach-Object {
        if ($_ -match '^\s*RABBIT_URL\s*=') { "RABBIT_URL=$NewRabbit" } else { $_ }
      } -join "`n"
    } else {
      $newContent = $content + "`nRABBIT_URL=$NewRabbit`n"
    }
    if ($newContent -ne $content) {
      Set-Content -Path $envFile -Value $newContent -Force
      Write-Host ".env updated in $($d.Name)"
      $changed = $true
    } else { Write-Host ".env already set in $($d.Name)" }
  }

  if (Test-Path $composeFile) {
    Write-Host "Found docker-compose.yml in $($d.Name) -> $composeFile"
    $bakc = Backup-File $composeFile
    Write-Host "Backed up to $bakc"
    $ccontent = Get-Content $composeFile -Raw
    # Replace explicit RABBIT_URL occurrences in env lines or environment lists
    $replaced = $false
    $lines = $ccontent -split "\r?\n"
    for ($i=0; $i -lt $lines.Length; $i++) {
      if ($lines[$i] -match 'RABBIT_URL\s*=') {
        # line like RABBIT_URL=...
        $lines[$i] = $lines[$i] -replace 'RABBIT_URL\s*=.*', "RABBIT_URL=$NewRabbit"
        $replaced = $true
      } elseif ($lines[$i] -match '-\s*RABBIT_URL\s*=') {
        $lines[$i] = $lines[$i] -replace '-\s*RABBIT_URL\s*=.*', "- RABBIT_URL=$NewRabbit"
        $replaced = $true
      }
    }
    $newc = $lines -join "`n"
    if ($replaced) {
      Set-Content -Path $composeFile -Value $newc -Force
      Write-Host "docker-compose.yml updated in $($d.Name)"
      $changed = $true
    } else { Write-Host "No explicit RABBIT_URL lines to replace in docker-compose.yml for $($d.Name)" }
  }

  if ($changed) { $updated += $d.FullName }
}

if ($updated.Count -eq 0) { Write-Host "No files were changed." } else { Write-Host "Updated projects:`n$($updated -join "`n")" }

if ($ApplyCompose -and $updated.Count -gt 0) {
  Write-Host "Recreating docker-compose stacks for updated projects..."
  foreach ($p in $updated) {
    $composeFile = Join-Path $p 'docker-compose.yml'
    if (Test-Path $composeFile) {
      Write-Host "Running docker compose up for $p"
      Push-Location $p
      try {
        docker compose up -d --no-build --force-recreate
      } catch {
        Write-Warning ("docker compose up failed for {0}: {1}" -f $p, ($_ | Out-String).Trim())
      }
      Pop-Location
    } else {
      Write-Host "No docker-compose.yml in $p, skipping compose recreate"
    }
  }
}

Write-Host "Done."
