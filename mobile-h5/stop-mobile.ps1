$ErrorActionPreference = 'Stop'

Write-Host '正在查找前端服务（端口 5173 / 4173）…' -ForegroundColor Yellow

$ports = 5173, 4173
$stopped = @()
$found = $false

foreach ($port in $ports) {
  $conns = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
  if (-not $conns) { continue }
  $found = $true
  foreach ($procId in ($conns | Select-Object -ExpandProperty OwningProcess -Unique)) {
    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq 'node') {
      Stop-Process -Id $procId -Force
      $stopped += "端口 $port（PID $procId）"
    } else {
      Write-Host "端口 $port 被非 node 进程占用，已跳过（$($proc.ProcessName)）" -ForegroundColor DarkYellow
    }
  }
}

Start-Sleep -Milliseconds 400

if (-not $found) {
  Write-Host '前端服务当前没有在运行，无需停止。' -ForegroundColor DarkGray
} elseif ($stopped.Count -gt 0) {
  Write-Host ('已停止：' + ($stopped -join '，')) -ForegroundColor Green
} else {
  Write-Host '没有可停止的 node 进程。' -ForegroundColor DarkGray
}

Write-Host ''
Write-Host '注意：本脚本只停前端页面服务，不影响 MySQL 和后端 Java 进程。' -ForegroundColor DarkGray
Write-Host ''
