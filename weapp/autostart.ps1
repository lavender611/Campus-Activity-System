# 把后端启动脚本挂到 Windows「启动」文件夹：开机自动跑，窗口最小化
# 用法：开机自动启动.bat 安装 / 取消开机自动启动.bat 卸载
param(
  [ValidateSet('install', 'remove')]
  [string]$Action = 'install'
)

$here    = Split-Path -Parent $MyInvocation.MyCommand.Path
$runner  = Join-Path (Split-Path -Parent $here) 'backend\run-backend.cmd'
$startup = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup'
$lnk     = Join-Path $startup '校园活动后端.lnk'

if ($Action -eq 'remove') {
  if (Test-Path -LiteralPath $lnk) {
    Remove-Item -LiteralPath $lnk -Force
    Write-Host '已取消开机自动启动。' -ForegroundColor Green
  } else {
    Write-Host '本来就没有设置开机自动启动。' -ForegroundColor Gray
  }
  exit 0
}

if (-not (Test-Path -LiteralPath $runner)) {
  Write-Host "找不到后端启动脚本：$runner" -ForegroundColor Red
  exit 1
}

$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($lnk)
$sc.TargetPath       = $runner
$sc.WorkingDirectory = Split-Path -Parent $runner
$sc.WindowStyle      = 7          # 7 = 最小化启动
$sc.Description      = '校园活动后端（开机自动启动，关闭窗口即停止）'
$sc.Save()

Write-Host ''
Write-Host '已设置为开机自动启动。' -ForegroundColor Green
Write-Host "  快捷方式：$lnk"
Write-Host '  下次开机后端会自动跑起来（窗口最小化在任务栏）。' -ForegroundColor Gray
Write-Host '  不想开机启动了，双击「取消开机自动启动.bat」即可。' -ForegroundColor Gray
Write-Host ''
