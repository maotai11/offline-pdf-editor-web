param(
  [Parameter(Mandatory = $false)] [string]$Action = "help",
  [Parameter(Mandatory = $false)] [string]$Input,
  [Parameter(Mandatory = $false)] [string]$Output,
  [Parameter(Mandatory = $false)] [string]$Input2,
  [Parameter(Mandatory = $false)] [string]$Password,
  [Parameter(Mandatory = $false)] [string]$UserPassword,
  [Parameter(Mandatory = $false)] [string]$OwnerPassword,
  [Parameter(Mandatory = $false)] [string]$Allow = "none",
  [Parameter(Mandatory = $false)] [string]$Glob = "*.pdf",
  [Parameter(Mandatory = $false)] [string]$OutDir = ".",
  [Parameter(Mandatory = $false)] [int]$Dpi = 300,
  [Parameter(Mandatory = $false)] [string]$Lang = "eng"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Require-Tool([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required tool not found: $Name"
  }
}

function Ensure-Path([string]$Path) {
  if (-not (Test-Path $Path)) {
    throw "Path not found: $Path"
  }
}

function Help-Text {
@"
pdf_toolkit.ps1

Actions:
  help
  encrypt        -Input in.pdf -Output out.pdf -UserPassword 1234 -OwnerPassword owner
  decrypt        -Input in.pdf -Output out.pdf -Password 1234
  permissions    -Input in.pdf -Output out.pdf -OwnerPassword owner -Allow print|annotate|form|extract|all|none
  office2pdf     -Input file.docx -OutDir .\out
  pdf2text       -Input in.pdf -Output out.txt
  ocr            -Input in.pdf -Output out.pdf -Lang eng
  compare        -Input old.pdf -Input2 new.pdf -OutDir .\out
  batch-encrypt  -Glob *.pdf -OutDir .\enc -UserPassword 1234 -OwnerPassword owner
  batch-permissions -Glob *.pdf -OutDir .\perm -OwnerPassword owner [-UserPassword user] -Allow print|annotate|form|extract|all|none
  batch-pdf2text -Glob *.pdf -OutDir .\txt
  batch-ocr      -Glob *.pdf -OutDir .\ocr -Lang eng

Dependencies:
  qpdf      (encrypt/decrypt/permissions)
  soffice   (office2pdf)
  pdftotext (pdf2text/compare)
  ocrmypdf  (ocr/batch-ocr)
"@
}

function Run-QpdfEncrypt {
  Require-Tool "qpdf"
  Ensure-Path $Input
  if (-not $Output) { throw "Output is required for encrypt." }
  if (-not $UserPassword) { throw "UserPassword is required." }
  if (-not $OwnerPassword) { throw "OwnerPassword is required." }
  & qpdf --encrypt $UserPassword $OwnerPassword 256 -- "$Input" "$Output"
  Write-Host "Encrypted => $Output"
}

function Run-QpdfDecrypt {
  Require-Tool "qpdf"
  Ensure-Path $Input
  if (-not $Output) { throw "Output is required for decrypt." }
  if (-not $Password) { throw "Password is required." }
  & qpdf --password="$Password" --decrypt "$Input" "$Output"
  Write-Host "Decrypted => $Output"
}

function Run-QpdfPermissions {
  Require-Tool "qpdf"
  Ensure-Path $Input
  if (-not $Output) { throw "Output is required for permissions." }
  if (-not $OwnerPassword) { throw "OwnerPassword is required." }
  $u = if ($UserPassword) { $UserPassword } else { "" }
  $flags = @("--print=none", "--modify=none", "--extract=n", "--annotate=n", "--form=n")
  switch ($Allow.ToLower()) {
    "all"      { $flags = @("--print=full", "--modify=all", "--extract=y", "--annotate=y", "--form=y") }
    "print"    { $flags = @("--print=full", "--modify=none", "--extract=n", "--annotate=n", "--form=n") }
    "annotate" { $flags = @("--print=none", "--modify=none", "--extract=n", "--annotate=y", "--form=n") }
    "form"     { $flags = @("--print=none", "--modify=none", "--extract=n", "--annotate=n", "--form=y") }
    "extract"  { $flags = @("--print=none", "--modify=none", "--extract=y", "--annotate=n", "--form=n") }
    default    { }
  }
  & qpdf --encrypt $u $OwnerPassword 256 @flags -- "$Input" "$Output"
  Write-Host "Permissions applied => $Output"
}

function Run-OfficeToPdf {
  Require-Tool "soffice"
  Ensure-Path $Input
  if (-not $OutDir) { throw "OutDir is required." }
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
  & soffice --headless --convert-to pdf --outdir "$OutDir" "$Input"
  Write-Host "Converted office -> pdf in $OutDir"
}

function Run-PdfToText {
  Require-Tool "pdftotext"
  Ensure-Path $Input
  if (-not $Output) { throw "Output is required for pdf2text." }
  & pdftotext -layout "$Input" "$Output"
  Write-Host "Extracted text => $Output"
}

function Run-Ocr {
  Require-Tool "ocrmypdf"
  Ensure-Path $Input
  if (-not $Output) { throw "Output is required for ocr." }
  & ocrmypdf --skip-text --language $Lang "$Input" "$Output"
  Write-Host "OCR done => $Output"
}

function Run-Compare {
  Require-Tool "pdftotext"
  Ensure-Path $Input
  Ensure-Path $Input2
  if (-not $OutDir) { throw "OutDir is required." }
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
  $t1 = Join-Path $OutDir "compare_a.txt"
  $t2 = Join-Path $OutDir "compare_b.txt"
  $diff = Join-Path $OutDir "compare_diff.txt"
  & pdftotext -layout "$Input" "$t1"
  & pdftotext -layout "$Input2" "$t2"
  $a = Get-Content $t1 -ErrorAction SilentlyContinue
  $b = Get-Content $t2 -ErrorAction SilentlyContinue
  Compare-Object $a $b -IncludeEqual:$false | ForEach-Object { "$($_.SideIndicator) $($_.InputObject)" } | Set-Content $diff
  Write-Host "Compare done => $diff"
}

function Run-BatchEncrypt {
  Require-Tool "qpdf"
  if (-not $UserPassword) { throw "UserPassword is required." }
  if (-not $OwnerPassword) { throw "OwnerPassword is required." }
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
  $files = Get-ChildItem -Path . -Filter $Glob -File
  foreach ($f in $files) {
    $out = Join-Path $OutDir $f.Name
    & qpdf --encrypt $UserPassword $OwnerPassword 256 -- "$($f.FullName)" "$out"
    Write-Host "Encrypted: $($f.Name) => $out"
  }
}

function Run-BatchPermissions {
  Require-Tool "qpdf"
  if (-not $OwnerPassword) { throw "OwnerPassword is required." }
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
  $files = Get-ChildItem -Path . -Filter $Glob -File
  foreach ($f in $files) {
    $out = Join-Path $OutDir $f.Name
    $u = if ($UserPassword) { $UserPassword } else { "" }
    $flags = @("--print=none", "--modify=none", "--extract=n", "--annotate=n", "--form=n")
    switch ($Allow.ToLower()) {
      "all"      { $flags = @("--print=full", "--modify=all", "--extract=y", "--annotate=y", "--form=y") }
      "print"    { $flags = @("--print=full", "--modify=none", "--extract=n", "--annotate=n", "--form=n") }
      "annotate" { $flags = @("--print=none", "--modify=none", "--extract=n", "--annotate=y", "--form=n") }
      "form"     { $flags = @("--print=none", "--modify=none", "--extract=n", "--annotate=n", "--form=y") }
      "extract"  { $flags = @("--print=none", "--modify=none", "--extract=y", "--annotate=n", "--form=n") }
      default    { }
    }
    & qpdf --encrypt $u $OwnerPassword 256 @flags -- "$($f.FullName)" "$out"
    Write-Host "Permissions: $($f.Name) => $out"
  }
}

function Run-BatchPdfToText {
  Require-Tool "pdftotext"
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
  $files = Get-ChildItem -Path . -Filter $Glob -File
  foreach ($f in $files) {
    $out = Join-Path $OutDir "$($f.BaseName).txt"
    & pdftotext -layout "$($f.FullName)" "$out"
    Write-Host "Text: $($f.Name) => $out"
  }
}

function Run-BatchOcr {
  Require-Tool "ocrmypdf"
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
  $files = Get-ChildItem -Path . -Filter $Glob -File
  foreach ($f in $files) {
    $out = Join-Path $OutDir "$($f.BaseName).ocr.pdf"
    & ocrmypdf --skip-text --language $Lang "$($f.FullName)" "$out"
    Write-Host "OCR: $($f.Name) => $out"
  }
}

switch ($Action.ToLower()) {
  "help"         { Help-Text | Write-Host }
  "encrypt"      { Run-QpdfEncrypt }
  "decrypt"      { Run-QpdfDecrypt }
  "permissions"  { Run-QpdfPermissions }
  "office2pdf"   { Run-OfficeToPdf }
  "pdf2text"     { Run-PdfToText }
  "ocr"          { Run-Ocr }
  "compare"      { Run-Compare }
  "batch-encrypt"{ Run-BatchEncrypt }
  "batch-permissions" { Run-BatchPermissions }
  "batch-pdf2text"    { Run-BatchPdfToText }
  "batch-ocr"         { Run-BatchOcr }
  default        { throw "Unknown action: $Action. Use -Action help." }
}
