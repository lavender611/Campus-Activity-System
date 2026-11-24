# 一键启动：同步 IP -> 起 MySQL -> 起后端 -> 等接口就绪 -> 用开发者工具打开小程序
# 双击「一键启动.bat」即可，全程不用手动开任何东西

$ErrorActionPreference = 'Continue'
$here    = Split-Path -Parent $MyInvocation.MyCommand.Path   # weapp 目录
$project = Split-Path -Parent $here                          # CampusActivity_FullProject
$backend = Join-Path $project 'backend'
$pom     = Join-Path $backend 'pom.xml'
$runner  = Join-Path $backend 'run-backend.cmd'

function Say($msg, $color = 'Gray') { Write-Host $msg -ForegroundColor $color }

Say ''
Say '==========================================' 'Cyan'
Say '  校园活动 · 一键启动' 'Cyan'
Say '==========================================' 'Cyan'
Say ''

# ---------- 1. 探测局域网 IP，写入小程序 config ----------
$route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
         Sort-Object RouteMetric | Select-Object -First 1
$ip = $null
if ($route) {
  $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $route.InterfaceIndex -ErrorAction SilentlyContinue |
         Where-Object { $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1).IPAddress
}
if (-not $ip) {
  Say '[1/5] 没探到局域网 IP，小程序里的地址可能不对（本机调试仍可用 localhost）' 'Yellow'
} else {
  $conf = Join-Path $here 'utils\config.js'
  $lines = @(
    '// 后端地址配置：小程序没有 Vite 代理，必须直连后端的绝对地址',
    '// 电脑本机调试可用 http://localhost:8080/api',
    '// 手机真机预览必须写电脑的局域网 IP',
    '// 改完这里记得在微信开发者工具里勾选「不校验合法域名」，真机还要电脑防火墙放行 8080',
    '// 电脑换网络后 IP 会变，双击「一键启动.bat」会自动改这里',
    '// ★ 离线开关：false = 连后端（默认，配合「一键启动.bat」使用）',
    '//   true = 不连后端，直接用内置数据，打开就能用（没开电脑、没网时应急用）',
    'const OFFLINE = false',
    '',
    'module.exports = {',
    '  offline: OFFLINE,',
    "  baseUrl: 'http://$($ip):8080/api'",
    '}'
  )
  Set-Content -LiteralPath $conf -Value ($lines -join "`r`n") -Encoding utf8
  Say "[1/5] 电脑当前 IP：$ip，已写进小程序 utils\config.js" 'Green'
}

# ---------- 2. MySQL ----------
$mysql = Get-Service -Name 'MySQL*' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $mysql) {
  Say '[2/5] 没找到 MySQL 服务，跳过（若后端报数据库连不上，先确认 MySQL 已安装）' 'Yellow'
} elseif ($mysql.Status -eq 'Running') {
  Say "[2/5] MySQL 服务（$($mysql.Name)）已在运行" 'Green'
} else {
  try {
    Start-Service -Name $mysql.Name -ErrorAction Stop
    Say "[2/5] 已启动 MySQL 服务（$($mysql.Name)）" 'Green'
  } catch {
    Say "[2/5] MySQL 服务没启动，且自动启动失败（需要管理员权限）：$($_.Exception.Message)" 'Yellow'
    Say '      请手动打开「服务」启动 MySQL80，或右键以管理员身份运行本脚本' 'Yellow'
  }
}

# ---------- 3. 后端 ----------
$listening = Get-NetTCPConnection -State Listen -LocalPort 8080 -ErrorAction SilentlyContinue
if ($listening) {
  Say '[3/5] 检测到 8080 已有服务在监听，认为后端已在运行，跳过启动' 'Green'
} else {
  if (-not (Test-Path -LiteralPath $runner)) {
    Say "[3/5] 找不到后端启动脚本：$runner" 'Red'
    Read-Host '按回车退出'
    exit 1
  }
  $comspec = if (Test-Path -LiteralPath "$env:SystemRoot\System32\cmd.exe") { "$env:SystemRoot\System32\cmd.exe" } elseif ($env:ComSpec) { $env:ComSpec } else { $null }
  if (-not $comspec) {
    Say '[3/5] 找不到 cmd.exe，请直接双击 backend\run-backend.cmd 启动后端' 'Red'
  } else {
    Say '[3/5] 正在新窗口启动后端（Maven spring-boot:run），这个窗口别关…' 'Cyan'
    try {
      Start-Process -FilePath $comspec -ArgumentList '/c', "`"$runner`"" -WorkingDirectory $backend -WindowStyle Normal -ErrorAction Stop
    } catch {
      Say "      启动失败：$($_.Exception.Message)" 'Red'
      Say "      请手动双击：$runner" 'Yellow'
    }
    Start-Sleep -Seconds 9
    $young = Get-Process -Name 'java' -ErrorAction SilentlyContinue | Where-Object { $_.StartTime -gt (Get-Date).AddSeconds(-20) }
    if (-not $young) {
      Say '      暂时没看到后端进程，若后面的等待一直失败，直接双击这个文件启动：' 'Yellow'
      Say "      $runner" 'Yellow'
    }
  }
}

# ---------- 4. 等接口就绪 ----------
Say '[4/5] 等待后端接口就绪（首次启动要下载 Maven 依赖，可能要 1～3 分钟）…' 'Cyan'
$ok = $false
$deadline = (Get-Date).AddSeconds(260)
$waited = 0
while ((Get-Date) -lt $deadline) {
  try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/activities' -TimeoutSec 3 -UseBasicParsing
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch {
    Start-Sleep -Seconds 4
    $waited += 4
    if ($waited % 20 -eq 0) { Write-Host "      已等待 $waited 秒…" -ForegroundColor DarkGray }
  }
}
if ($ok) {
  Say '      后端已就绪：http://localhost:8080/api/activities 返回 200' 'Green'
  if ($ip) {
    try {
      $r2 = Invoke-WebRequest -Uri "http://$($ip):8080/api/activities" -TimeoutSec 3 -UseBasicParsing
      Say "      局域网地址也可访问：http://$($ip):8080 （手机可以连）" 'Green'
    } catch {
      Say "      局域网地址 $ip 暂时不通，多半是防火墙没放行 8080（右键管理员运行「放行后端8080.bat」）" 'Yellow'
    }
  }
}

if (-not $ok) {
  Say '      等了 260 秒后端还没起来。去那个"校园活动后端"窗口看报错，常见原因：' 'Red'
  Say '        1) MySQL 没启动 / 数据库密码不对；2) 8080 被占用；3) 首次下载依赖很慢，再等等' 'Yellow'
}

# ---------- 5. 打开微信开发者工具里的项目 ----------
$cli = @(
  'C:\Users\chen\微信开发者工具\微信web开发者工具\cli.bat',
  'C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat',
  'C:\Program Files\Tencent\微信web开发者工具\cli.bat'
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if ($cli) {
  Say '[5/5] 正在让微信开发者工具打开小程序项目…' 'Cyan'
  $opened = $false
  try {
    $out = & $cli open --project $here 2>&1 | Out-String
    Write-Host $out
    if ($out -match 'initialize' -and $out -notmatch '[×x]\s*initialize') { $opened = $true }
  } catch {}
  if (-not $opened) {
    Say '      CLI 没成功：工具里「设置 → 安全设置 → 服务端口」需要先打开（只需一次）。' 'Yellow'
    Say '      现在改为直接启动微信开发者工具，上次打开的项目会自动加载。' 'Yellow'
    $exe = @(
      'C:\Users\chen\微信开发者工具\微信web开发者工具\微信开发者工具.exe',
      'C:\Program Files (x86)\Tencent\微信web开发者工具\微信开发者工具.exe'
    ) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if ($exe) {
      Start-Process -FilePath $exe | Out-Null
      Say '      已启动开发者工具，等它加载完点一下「编译」即可。' 'Green'
    } else {
      Say "      手动打开工具并导入目录：$here" 'Yellow'
    }
  }
} else {
  Say '[5/5] 没找到微信开发者工具的 cli.bat，请手动打开工具并导入：' 'Yellow'
  Say "      $here" 'Yellow'
}

Say ''
Say '==========================================' 'Cyan'
Say '  都搞定了。回到微信开发者工具点一下「编译」，' 'Cyan'
Say '  列表右上角不再有橙色「演示数据」标记就说明连上真实后端了。' 'Cyan'
Say '==========================================' 'Cyan'
Say ''
