# 自动探测电脑当前局域网 IP，写进 utils/config.js 的 baseUrl
# 电脑换了 Wi-Fi / 重启路由后 IP 会变，跑一次这个脚本就行
$dir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$conf = Join-Path $dir 'utils\config.js'

# 取默认路由（真正能上网那块网卡）的 IPv4，排除 127.0.0.1 和 169.254.x 这类无效地址
$route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
         Sort-Object RouteMetric | Select-Object -First 1
$ip = $null
if ($route) {
  $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $route.InterfaceIndex -ErrorAction SilentlyContinue |
         Where-Object { $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1).IPAddress
}
if (-not $ip) {
  Write-Host '没探到可用的局域网 IP。请手动打开 utils\config.js，把 baseUrl 改成 http://电脑IP:8080/api' -ForegroundColor Red
  exit 1
}

$lines = @(
  '// 后端地址配置：小程序没有 Vite 代理，必须直连后端的绝对地址',
  '// 电脑本机调试可用 http://localhost:8080/api',
  '// 手机真机预览必须写电脑的局域网 IP',
  '// 改完这里记得在微信开发者工具里勾选「不校验合法域名」，真机还要电脑防火墙放行 8080',
  '// 电脑换网络后 IP 会变，双击「更新后端地址.bat」可自动改这里',
  'module.exports = {',
  "  baseUrl: 'http://$($ip):8080/api'",
  '}'
)
Set-Content -LiteralPath $conf -Value ($lines -join "`r`n") -Encoding utf8

Write-Host ''
Write-Host "当前电脑 IP：$ip" -ForegroundColor Cyan
Write-Host "已写入：$conf"
Write-Host ''

# 顺便探一下后端，省得回工具里才发现没起来
try {
  $r = Invoke-WebRequest -Uri "http://$($ip):8080/api/activities" -TimeoutSec 5 -UseBasicParsing
  Write-Host "后端探测：http://$($ip):8080 返回 $($r.StatusCode)，接口正常" -ForegroundColor Green
} catch {
  Write-Host "后端探测：http://$($ip):8080 不通" -ForegroundColor Yellow
  Write-Host '  先确认 IDEA 里的 CampusActivityApplication 已启动（8080 有监听），防火墙放行 8080' -ForegroundColor Yellow
}

# 防火墙规则状态
$rule = Get-NetFirewallRule -DisplayName 'CampusActivity-Backend-8080' -ErrorAction SilentlyContinue
if ($rule -and $rule.Enabled -eq 'True') {
  Write-Host '防火墙：规则 CampusActivity-Backend-8080 已启用' -ForegroundColor Green
} else {
  Write-Host '防火墙：没有找到 8080 放行规则，请右键管理员运行「放行后端8080.bat」' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '回到微信开发者工具点一下「编译」（或模拟器下方的刷新按钮），右上角「演示数据」标记消失即为连上。'
