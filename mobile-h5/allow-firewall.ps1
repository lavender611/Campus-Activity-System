param([switch]$NoPause)

$ErrorActionPreference = 'Stop'

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
  Write-Host '需要管理员权限：请右键“允许手机访问.bat”，选择“以管理员身份运行”。' -ForegroundColor Red
  Read-Host '按回车退出'
  exit 1
}

$ruleName = 'CampusActivity-Mobile-5173'
Write-Host '正在放行 TCP 5173 端口（专用网络 + 公用网络）…' -ForegroundColor Yellow

try {
  $old = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
  if ($old) { $old | Remove-NetFirewallRule }

  New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow -Profile Private,Public -Enabled True | Out-Null

  $check = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
  if (-not $check) { throw '规则没有创建成功' }

  Write-Host ('已放行：' + $check.DisplayName) -ForegroundColor Green
  Write-Host '手机现在可以访问本机 5173 端口（前提是前端服务正在运行）。' -ForegroundColor Green
} catch {
  Write-Host ('放行失败：' + $_.Exception.Message) -ForegroundColor Red
}

if (-not $NoPause) { Read-Host '按回车退出' }
