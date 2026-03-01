# setup.ps1 -- Download JS libraries for offline PDF editor
# Run ONCE on a machine with internet access.
# Usage: .\setup.ps1

$ErrorActionPreference = "Stop"
$lib = Join-Path $PSScriptRoot "lib"
New-Item -ItemType Directory -Path $lib -Force | Out-Null

$files = @(
    @{ Name = "pdf.min.js";        Url = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" },
    @{ Name = "pdf.worker.min.js"; Url = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" },
    @{ Name = "pdf-lib.min.js";    Url = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" }
)

foreach ($f in $files) {
    $dest = Join-Path $lib $f.Name
    if (Test-Path $dest) {
        Write-Host "Already exists: $($f.Name)" -ForegroundColor DarkGray
        continue
    }
    Write-Host "Downloading: $($f.Name) ..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $f.Url -OutFile $dest -UseBasicParsing
    Write-Host "  OK ($([math]::Round((Get-Item $dest).Length/1KB,0)) KB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done! Open index.html with Firefox (works natively with file://)." -ForegroundColor Green
Write-Host "Chrome requires: chrome.exe --allow-file-access-from-files" -ForegroundColor Yellow
