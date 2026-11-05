$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$dist = Join-Path $root "dist"
$zip = Join-Path $root "tristhanilarde-site.zip"

if (Test-Path -LiteralPath $dist) {
    Remove-Item -LiteralPath $dist -Recurse -Force
}
New-Item -ItemType Directory -Path $dist | Out-Null

$files = @(
    "index.html",
    "styles.css",
    "script.js",
    "favicon.svg",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "_headers"
)

foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $root $file) -Destination $dist
}

Copy-Item -LiteralPath (Join-Path $root "assets") -Destination $dist -Recurse

if (Test-Path -LiteralPath $zip) {
    Remove-Item -LiteralPath $zip -Force
}

Compress-Archive -Path (Join-Path $dist "*") -DestinationPath $zip -CompressionLevel Optimal

Write-Host "Created: $zip"
Write-Host "Folder:  $dist"
