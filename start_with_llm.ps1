$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$existing = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    $pidOnPort = $existing.OwningProcess | Select-Object -First 1
    Write-Host "Port 8000 is already in use by process $pidOnPort." -ForegroundColor Yellow
    Write-Host "Stop it first with: Stop-Process -Id $pidOnPort" -ForegroundColor Yellow
    exit 1
}

$apiKey = Read-Host "Paste your NEW OpenAI API key"
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "No API key entered. Exiting." -ForegroundColor Red
    exit 1
}

$env:OPENAI_API_KEY = $apiKey.Trim()
$env:OPENAI_MODEL = "gpt-4o-mini"

Write-Host "Starting AI Tutoring System with LLM enabled..." -ForegroundColor Green
Write-Host "Open http://127.0.0.1:8000 in your browser." -ForegroundColor Green
python app.py
