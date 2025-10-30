param(
    [string]$Path,
    [switch]$All
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$basePath = "D:\\Code\\Temp"
$baseFull = [System.IO.Path]::GetFullPath($basePath)

if (-not (Test-Path $baseFull)) {
    Write-Host "Nothing to clean. Base directory '$baseFull' does not exist." -ForegroundColor Yellow
    return
}

function Remove-TargetDirectory([string]$target) {
    $full = [System.IO.Path]::GetFullPath($target)
    $normalizedBase = $baseFull
    if (-not $normalizedBase.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
        $normalizedBase += [System.IO.Path]::DirectorySeparatorChar
    }
    if (-not $full.StartsWith($normalizedBase, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to delete '$full' because it is outside '$baseFull'."
    }
    if (-not (Test-Path $full)) {
        Write-Host "Skip: '$full' not found." -ForegroundColor Yellow
        return
    }
    Remove-Item -Recurse -Force $full
    Write-Host "Removed: $full" -ForegroundColor Green
}

if ($All) {
    Get-ChildItem -LiteralPath $baseFull -Directory -Filter "one-portal-act-*" | ForEach-Object {
        Remove-TargetDirectory $_.FullName
    }
    return
}

if ([string]::IsNullOrWhiteSpace($Path)) {
    throw "Specify -Path to remove a single directory or use -All to delete every one-portal-act-* folder."
}

$resolvedInput = if (Test-Path $Path) { (Resolve-Path $Path).Path } else { Join-Path $baseFull $Path }
Remove-TargetDirectory $resolvedInput
