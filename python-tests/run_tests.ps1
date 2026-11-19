#!/usr/bin/env pwsh
# 一键运行 Python 接口自动化测试（Windows PowerShell）
# 用法：
#   .\run_tests.ps1                      # 全量运行，生成 HTML 报告
#   .\run_tests.ps1 -m smoke             # 只跑冒烟用例
#   .\run_tests.ps1 -k register          # 只跑名字包含 register 的用例
#   .\run_tests.ps1 --base-url http://127.0.0.1:8080   # 指定已运行的后端
# 注意：本文件必须以「UTF-8 带 BOM」保存，否则 Windows PowerShell 5.1 会把中文读成乱码。

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $PytestArgs
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
# 保证在任意目录调用本脚本都能正确找到 pytest.ini 与 tests/
Set-Location $root
$venv = Join-Path $root '.venv'
$python = Join-Path $venv 'Scripts\python.exe'

if (-not (Test-Path $python)) {
    Write-Host '[setup] 创建虚拟环境 .venv ...' -ForegroundColor Cyan
    python -m venv $venv
    if ($LASTEXITCODE -ne 0) { throw '创建虚拟环境失败，请确认已安装 Python 3.9+' }
}

Write-Host '[setup] 检查依赖 ...' -ForegroundColor Cyan
& $python -m pip install --quiet --disable-pip-version-check -r (Join-Path $root 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'pip 安装依赖失败' }

$env:PYTHONIOENCODING = 'utf-8'
$reportDir = Join-Path $root 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$pytestCmd = @('-m', 'pytest', "--html=$reportDir\report.html", '--self-contained-html')
if ($PytestArgs) { $pytestCmd += $PytestArgs }

Write-Host ("[run] python " + ($pytestCmd -join ' ')) -ForegroundColor Cyan
& $python @pytestCmd
$code = $LASTEXITCODE

Write-Host ''
if ($code -eq 0) {
    Write-Host "[ok] 全部用例通过，报告：$reportDir\report.html" -ForegroundColor Green
} else {
    Write-Host "[fail] 存在失败用例（退出码 $code），报告：$reportDir\report.html" -ForegroundColor Red
}
exit $code
