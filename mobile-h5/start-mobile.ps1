param([switch]$NoServer)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

Write-Host '==================================================' -ForegroundColor Cyan
Write-Host '  校园活动报名 · 手机版（H5）' -ForegroundColor Cyan
Write-Host '==================================================' -ForegroundColor Cyan
Write-Host ''

if (-not (Test-Path -LiteralPath 'node_modules')) {
  Write-Host '[1/2] 首次运行，正在安装依赖，请稍候…' -ForegroundColor Yellow
  & npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) {
    Write-Host '依赖安装失败，请检查网络后重新双击本文件。' -ForegroundColor Red
    Read-Host '按回车退出'
    exit 1
  }
}

Write-Host '[2/2] 启动开发服务器' -ForegroundColor Yellow
Write-Host ''
Write-Host '电脑访问：http://localhost:5173'
Write-Host '手机访问（手机要和电脑连同一个 Wi-Fi，选与本机同一网段的地址）：'
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
  ForEach-Object { Write-Host ('    http://' + $_.IPAddress + ':5173') -ForegroundColor Green }
Write-Host ''
Write-Host '手机打不开时：右键“以管理员身份运行”本目录下的“允许手机访问.bat”' -ForegroundColor DarkGray
Write-Host '停止服务：在本窗口按 Ctrl + C' -ForegroundColor DarkGray
Write-Host ''

if ($NoServer) {
  Write-Host '已跳过启动服务（-NoServer）。' -ForegroundColor DarkGray
  exit 0
}

& npm run dev
