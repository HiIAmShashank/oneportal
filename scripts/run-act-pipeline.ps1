param(
	[string]$SourceRepo,
	[string]$SecretsFile = ".secrets",
	[string]$TempDirectory,
	[string[]]$ActArguments
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-RepoRoot {
	param([string]$Path)

	if ([string]::IsNullOrWhiteSpace($Path)) {
		$gitRoot = git rev-parse --show-toplevel 2>$null
		if (-not $gitRoot) {
			throw "Unable to resolve repository root automatically. Provide -SourceRepo."
		}
		return (Resolve-Path $gitRoot).Path
	}

	if (-not (Test-Path $Path)) {
		throw "Source repository path '$Path' does not exist."
	}

	return (Resolve-Path $Path).Path
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
	throw "git is required but not found in PATH."
}

if (-not (Get-Command act -ErrorAction SilentlyContinue)) {
	throw "act is required but not found in PATH."
}

$repoRoot = Resolve-RepoRoot -Path $SourceRepo

if ([string]::IsNullOrWhiteSpace($TempDirectory)) {
	$baseTempPath = "D:\\Code\\Temp"
	if (-not (Test-Path $baseTempPath)) {
		New-Item -ItemType Directory -Path $baseTempPath -Force | Out-Null
	}
	$TempDirectory = Join-Path $baseTempPath ("one-portal-act-" + [System.Guid]::NewGuid().ToString("N"))
}

$cloneDir = [System.IO.Path]::GetFullPath($TempDirectory)
$cloneParent = Split-Path -Parent $cloneDir
if (-not [string]::IsNullOrWhiteSpace($cloneParent) -and -not (Test-Path $cloneParent)) {
	New-Item -ItemType Directory -Path $cloneParent -Force | Out-Null
}

if (Test-Path $cloneDir) {
	throw "Temporary clone directory '$cloneDir' already exists. Provide a unique path or remove it before running."
}

Write-Host "Cloning repository to temporary directory..." -ForegroundColor Cyan
git clone --quiet $repoRoot $cloneDir
$cloneDir = (Resolve-Path $cloneDir).Path

$secretsSource = Join-Path $repoRoot $SecretsFile
if (Test-Path $secretsSource) {
	Copy-Item -LiteralPath $secretsSource -Destination (Join-Path $cloneDir $SecretsFile) -Force
	Write-Host "Copied secrets file to temporary clone." -ForegroundColor Cyan
} else {
	Write-Warning "Secrets file '$SecretsFile' not found in source repository. act may fail if secrets are required."
}

$originalLocation = Get-Location
Push-Location $cloneDir

$removePnpmStore = $false
$pnpmStoreForRun = $null

try {
	$previousAct = $env:ACT
	$previousPnpmStore = $env:PNPM_STORE_PATH
	$env:ACT = "true"

	if ([string]::IsNullOrWhiteSpace($env:PNPM_STORE_PATH)) {
		$env:PNPM_STORE_PATH = Join-Path $cloneDir "pnpm-store"
		$removePnpmStore = $true
	}

	$pnpmStoreForRun = $env:PNPM_STORE_PATH

	if (-not (Test-Path $pnpmStoreForRun)) {
		New-Item -ItemType Directory -Path $pnpmStoreForRun | Out-Null
	}

	Write-Host "Running act inside temporary clone..." -ForegroundColor Cyan

	$actArgs = @()
	if ($ActArguments -and $ActArguments.Length -gt 0) {
		$actArgs = $ActArguments
	} else {
		$actArgs = @('--container-architecture', 'linux/amd64')
	}

	$secretsPath = Join-Path $cloneDir $SecretsFile
	$hasSecretsArg = $false
	for ($i = 0; $i -lt $actArgs.Length; $i++) {
		if ($actArgs[$i] -like '--secret-file*') {
			$hasSecretsArg = $true
			break
		}
	}
	if (-not $hasSecretsArg -and (Test-Path $secretsPath)) {
		$actArgs += @('--secret-file', $secretsPath)
	}

	act @actArgs

	Write-Host "act execution completed." -ForegroundColor Green
}
finally {
	Pop-Location
	if ($previousAct) {
		$env:ACT = $previousAct
	} else {
		Remove-Item Env:ACT -ErrorAction SilentlyContinue
	}

	if ($previousPnpmStore) {
		$env:PNPM_STORE_PATH = $previousPnpmStore
	} else {
		Remove-Item Env:PNPM_STORE_PATH -ErrorAction SilentlyContinue
	}
}

Write-Host "Temporary clone at: $cloneDir" -ForegroundColor Yellow
if ($removePnpmStore -and $pnpmStoreForRun) {
	Write-Host "Temporary pnpm store at: $pnpmStoreForRun" -ForegroundColor Yellow
}