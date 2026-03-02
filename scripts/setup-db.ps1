# تشغيل إعداد قاعدة البيانات (بعد التأكد من وجود مساحة كافية على القرص)
# Run: .\scripts\setup-db.ps1  أو  pwsh -File scripts/setup-db.ps1

Set-Location $PSScriptRoot\..

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "تم نسخ .env.example إلى .env"
}

if (-not (Test-Path db)) {
    New-Item -ItemType Directory -Path db | Out-Null
    Write-Host "تم إنشاء مجلد db"
}

Write-Host "تشغيل npx prisma generate..."
npx prisma generate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "تشغيل npx prisma migrate deploy..."
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "تم إعداد قاعدة البيانات بنجاح."
