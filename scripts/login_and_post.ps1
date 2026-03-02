param(
  [Parameter(Mandatory=$false)][string]$ImagePath = "",
  [Parameter(Mandatory=$false)][string]$ImageUrl = ""
)

function ExitWithError($msg) { Write-Error $msg; exit 1 }

$BaseUrl = $env:BASE_URL
if (-not $BaseUrl) { $BaseUrl = "http://localhost:4000/api" }
$Email = "243704@ids.upchiapas.edu.mx"
$Password = "TestPass123!"
$NAME = "Test User 243704"

Write-Host "Base URL: $BaseUrl"
Write-Host "Logging in as $Email"

# Login
try {
  $loginBody = @{ email = $Email; password = $Password } | ConvertTo-Json
  $loginResp = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody -ContentType 'application/json' -ErrorAction Stop
} catch {
  $err = $_.Exception
  if ($err.Response -and $err.Response.Content) {
    try { $content = $err.Response.Content | ConvertFrom-Json } catch { $content = $err.Response.Content }
    Write-Error "Login failed: $content"
  } else { Write-Error "Login failed: $err" }
  ExitWithError "Login failed"
}

$token = $loginResp.token
if (-not $token -and $loginResp.user -and $loginResp.user.token) { $token = $loginResp.user.token }
if (-not $token) { ExitWithError "Token not found in login response." }
Write-Host "Token obtained (length $($token.Length))"

$SqlUserId = $null
if ($loginResp.user) {
  if ($loginResp.user.id) { $SqlUserId = $loginResp.user.id }
  elseif ($loginResp.user._id) { $SqlUserId = $loginResp.user._id }
}
if ($SqlUserId) { Write-Host "sql_user_id: $SqlUserId" } else { Write-Warning "sql_user_id not present in login response." }

# Determine IMAGE_URL: prefer env, then param
if ($env:IMAGE_URL) { $IMAGE_URL = $env:IMAGE_URL } elseif ($ImageUrl) { $IMAGE_URL = $ImageUrl } else { $IMAGE_URL = "" }

if (-not $IMAGE_URL) {
  if ($ImagePath -and (Test-Path $ImagePath)) {
    $fname = [IO.Path]::GetFileName($ImagePath)
    Write-Host "Uploading $ImagePath to transfer.sh..."
    try {
      $uploadResp = Invoke-RestMethod -Uri "https://transfer.sh/$fname" -Method Put -InFile $ImagePath -UseBasicParsing -ErrorAction Stop
      $IMAGE_URL = $uploadResp.Trim()
      Write-Host "Uploaded -> $IMAGE_URL"
    } catch {
      Write-Warning "Upload failed: $_"
      ExitWithError "Image upload failed and no IMAGE_URL provided."
    }
  } else {
    ExitWithError "No IMAGE_URL provided and ImagePath not valid."
  }
} else {
  $IMAGE_URL = $IMAGE_URL.Trim()
  Write-Host "Using IMAGE_URL: $IMAGE_URL"
}

# Basic validation: ensure URL looks like http/https
if (-not ($IMAGE_URL -match '^https?://')) {
  ExitWithError "IMAGE_URL does not look like a valid http/https URL: $IMAGE_URL"
}

function Build-PostPayload($userId, $imageUrl) {
  return @{ sql_user_id = $userId; type = "image"; title = "Test Image Upload"; content = $imageUrl; description = "Uploaded by automated test" }
}

Write-Host "Creating post..."

# Attempt to create post with retries
$maxAttempts = 5
$attempt = 0
$created = $false
while ($attempt -lt $maxAttempts -and -not $created) {
  $attempt++
  Write-Host "Attempt $attempt of $maxAttempts to create post..."
  try {
    $headers = @{ Authorization = "Bearer $token" }
    # Rebuild payload with current user id to ensure it is correct
    $postPayload = Build-PostPayload $SqlUserId $IMAGE_URL
    $postBody = $postPayload | ConvertTo-Json
    $createResp = Invoke-RestMethod -Uri "$BaseUrl/posts" -Method Post -Body $postBody -ContentType 'application/json' -Headers $headers -ErrorAction Stop
    Write-Host "Post created successfully on attempt $attempt" -ForegroundColor Green
    Write-Output ($createResp | ConvertTo-Json -Depth 5)
    $created = $true
    break
  } catch {
    $err = $_.Exception
    Write-Warning "Create post attempt $attempt failed: $err"
    # inspect for replication error
    $body = $null
    if ($err.Response -and $err.Response.Content) {
      try { $body = $err.Response.Content | ConvertFrom-Json } catch { $body = $err.Response.Content }
    }
    $detectedReplication = $false
    if ($body -and ($body.message -like '*replicated*' -or $body.error -eq 'UNAUTHORIZED')) { $detectedReplication = $true }
    if (-not $detectedReplication -and $err.Message -and ($err.Message -match '401|Unauthorized|UNAUTHORIZED')) { $detectedReplication = $true }
    if ($detectedReplication) {
      Write-Warning "Detected replication/unauthorized issue: $($body -or $err.Message)"
      if ($attempt -lt $maxAttempts) {
        Write-Host "Waiting 5s before retrying..."
        Start-Sleep -Seconds 5
        continue
      }
    }
    if ($body) { Write-Warning "Response body: $(ConvertTo-Json $body -Depth 5)" }
    if ($attempt -ge $maxAttempts) {
      Write-Warning "Max attempts reached and creation failed. Proceeding to attempt cleanup and re-register flow."
      # Try to delete user via gateway
      if (-not [string]::IsNullOrEmpty($SqlUserId)) {
        Write-Host "Attempting to delete user $SqlUserId via gateway..."
        try {
          # Try with Authorization header first
          $delHeaders = @{ Authorization = "Bearer $token" }
          $delResp = Invoke-RestMethod -Uri "$BaseUrl/users/$SqlUserId" -Method Delete -Headers $delHeaders -ErrorAction Stop
          Write-Host "Delete user response: $(ConvertTo-Json $delResp)"
        } catch {
          Write-Warning "Delete with auth failed: $_. Trying without auth..."
          try {
            $delResp = Invoke-RestMethod -Uri "$BaseUrl/users/$SqlUserId" -Method Delete -ErrorAction Stop
            Write-Host "Delete user response (no auth): $(ConvertTo-Json $delResp)"
          } catch {
            Write-Warning "Delete user failed: $_"
          }
        }
      } else {
        Write-Warning "No sql_user_id available to delete. Skipping delete."
      }

      # Re-register the user
      Write-Host "Re-registering user $Email..."
      try {
        $regBody = @{ name = $NAME; email = $Email; password = $Password } | ConvertTo-Json
        $regResp = Invoke-RestMethod -Uri "$BaseUrl/users" -Method Post -Body $regBody -ContentType 'application/json' -ErrorAction Stop
        Write-Host "Register response: $(ConvertTo-Json $regResp)"
      } catch {
        Write-Warning "Register failed: $_"
      }

      # Login again to get fresh token
      Write-Host "Logging in after re-register..."
      try {
        $loginBody2 = @{ email = $Email; password = $Password } | ConvertTo-Json
        $loginResp2 = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody2 -ContentType 'application/json' -ErrorAction Stop
        $token = $loginResp2.token
        if (-not $token -and $loginResp2.user -and $loginResp2.user.token) { $token = $loginResp2.user.token }
        Write-Host "New token length: $($token.Length)"
        if ($loginResp2.user) {
          if ($loginResp2.user.id) { $SqlUserId = $loginResp2.user.id }
          elseif ($loginResp2.user._id) { $SqlUserId = $loginResp2.user._id }
          Write-Host "New sql_user_id: $SqlUserId"
        }
      } catch {
        Write-Warning "Re-login failed: $_"
      }

      # final attempt to create post after re-register
      try {
        Write-Host "Final attempt to create post after re-register..."
        $headers = @{ Authorization = "Bearer $token" }
        # rebuild payload after re-register to ensure new user id is used
        $postPayload = Build-PostPayload $SqlUserId $IMAGE_URL
        $postBody = $postPayload | ConvertTo-Json
        # Try multiple times to allow replication to propagate
        $repAttempts = 12
        $repAttempt = 0
        while ($repAttempt -lt $repAttempts -and -not $created) {
          $repAttempt++
          try {
            $createResp = Invoke-RestMethod -Uri "$BaseUrl/posts" -Method Post -Body $postBody -ContentType 'application/json' -Headers $headers -ErrorAction Stop
            Write-Host "Post created successfully after re-register (attempt $repAttempt)" -ForegroundColor Green
            Write-Output ($createResp | ConvertTo-Json -Depth 5)
            $created = $true
            break
          } catch {
            $e = $_.Exception
            $body = $null
            if ($e.Response -and $e.Response.Content) {
              try { $body = $e.Response.Content | ConvertFrom-Json } catch { $body = $e.Response.Content }
            }
            if (($body -and $body.message -like '*replicated*') -or ($e.Message -and ($e.Message -match '401|Unauthorized|UNAUTHORIZED'))) {
              Write-Warning "User not replicated yet. Waiting 10s before next attempt ($repAttempt/$repAttempts)..."
              Start-Sleep -Seconds 10
              continue
            } else {
              Write-Warning "Final create post attempt failed: $e"
              if ($body) { Write-Warning "Response body: $(ConvertTo-Json $body -Depth 5)" }
              break
            }
          }
        }
      } catch {
        Write-Warning "Final create post error: $_"
      }
    }
  }
}

if (-not $created) { ExitWithError "Could not create post after retries and re-register flow." }

Write-Host "Post created successfully:" -ForegroundColor Green
Write-Output ($createResp | ConvertTo-Json -Depth 5)

 
