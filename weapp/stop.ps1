# 一键停止：结束占用 8080 的后端进程
$ErrorActionPreference = 'Continue'
Write-Host ''
Write-Host '=== 停止校园活动后端 ===' -ForegroundColor Cyan

$conns = Get-NetTCPConnection -State Listen -LocalPort 8080 -ErrorAction SilentlyContinue
if (-not $conns) {
  Write-Host '8080 没有服务在跑，无需停止。' -ForegroundColor Green
} else {
  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($procId in $pids) {
    try {
      $p = Get-Process -Id $procId -ErrorAction Stop
      Write-Host "结束进程: $($p.ProcessName) (PID $procId)" -ForegroundColor Yellow
      Stop-Process -Id $procId -Force -ErrorAction Stop
    } catch {
      Write-Host "结束 PID $procId 失败：$($_.Exception.Message)（可能需要管理员权限）" -ForegroundColor Yellow
    }
  }
  Start-Sleep -Seconds 2
  if (Get-NetTCPConnection -State Listen -LocalPort 8080 -ErrorAction SilentlyContinue) {
    Write-Host '端口 8080 仍被占用，请到「校园活动后端」窗口按 Ctrl+C，或右键管理员运行本脚本。' -ForegroundColor Yellow
  } else {
    Write-Host '后端已停止，8080 已释放。' -ForegroundColor Green
  }
}

Write-Host ''
Write-Host '小程序不受影响：后端停掉后它会自动切到内置演示数据，页面照常能用。' -ForegroundColor Gray
Write-Host ''
