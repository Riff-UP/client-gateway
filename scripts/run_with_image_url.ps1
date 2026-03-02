param(
  [Parameter(Mandatory=$true)][string]$ImagePath,
  [Parameter(Mandatory=$true)][string]$ImageUrl
)

# Set environment variable in this process and call login_and_post.ps1
$ENV:IMAGE_URL = $ImageUrl
Write-Host "Set IMAGE_URL=$ImageUrl"
& "./scripts/login_and_post.ps1" $ImagePath
