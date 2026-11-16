<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import { ACTIVITIES, CATEGORIES } from '../store'

const filterCat = ref('全部')
const filterRange = ref('全部时间')

const barEl = ref()
const pieEl = ref()
let barChart = null
let pieChart = null

// 时间范围判断（与列表页口径一致）
function inTimeRange(startAt, range) {
  if (range === '全部时间') return true
  const now = new Date()
  const act = new Date(startAt.replace(' ', 'T'))
  const diffDays = (act - now) / 86400000
  if (range === '本周内') return diffDays >= -1 && diffDays <= 7
  if (range === '本月内') return diffDays >= -1 && diffDays <= 30
  return true
}

const filtered = computed(() =>
  ACTIVITIES.filter((a) => {
    const matchCat = filterCat.value === '全部' || a.category === filterCat.value
    return matchCat && inTimeRange(a.startAt, filterRange.value)
  })
)

const stats = computed(() => {
  const totalSignup = filtered.value.reduce((s, a) => s + a.signed, 0)
  const totalCapacity = filtered.value.reduce((s, a) => s + a.capacity, 0)
  const fullCount = filtered.value.filter((a) => a.signed >= a.capacity).length
  const fillRate = totalCapacity ? Math.round((totalSignup / totalCapacity) * 100) : 0
  return { total: filtered.value.length, totalSignup, fillRate, fullCount }
})

// 类别色板：分类取不同色相，全页复用
const PIE_COLORS = ['#2563A8', '#2F7D5B', '#C8862A', '#7A6BB0', '#C0563F']

function renderCharts() {
  if (!barChart || !pieChart) return
  const list = filtered.value

  // 柱状图：热门活动报名人数（分类比较，单一品牌色）
  const barData = list.slice().sort((a, b) => b.signed - a.signed)
  barChart.setOption({
    grid: { left: '12%', right: '6%', top: '12%', bottom: '22%' },
    tooltip: { trigger: 'axis', confine: true },
    xAxis: {
      type: 'category',
      data: barData.map((a) => a.title),
      axisLabel: { rotate: 30, interval: 0, fontSize: 11 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#edf1f6' } } },
    series: [
      {
        type: 'bar',
        data: barData.map((a) => a.signed),
        itemStyle: { color: '#2563A8', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 36
      }
    ]
  }, true)

  // 饼图：类别分布（部分与整体，≤5 类）
  const catMap = {}
  list.forEach((a) => { catMap[a.category] = (catMap[a.category] || 0) + 1 })
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }))
  pieChart.setOption({
    color: PIE_COLORS,
    tooltip: { trigger: 'item', confine: true },
    legend: { type: 'scroll', bottom: 0, icon: 'circle' },
    series: [
      {
        type: 'pie',
        radius: ['38%', '64%'],
        center: ['50%', '44%'],
        label: { show: true, formatter: (p) => `${p.name} ${p.percent}%` },
        data: pieData
      }
    ]
  }, true)
}

let resizeObserver = null

onMounted(() => {
  barChart = echarts.init(barEl.value)
  pieChart = echarts.init(pieEl.value)
  resizeObserver = new ResizeObserver(() => {
    barChart.resize()
    pieChart.resize()
  })
  resizeObserver.observe(barEl.value)
  resizeObserver.observe(pieEl.value)
  renderCharts()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  barChart?.dispose()
  pieChart?.dispose()
})

watch([filterCat, filterRange], renderCharts)
</script>

<template>
  <div class="page-wrap">
    <div class="page-head">
      <h2>数据分析</h2>
      <p>基于报名记录统计人数与活动热度，辅助活动组织决策</p>
    </div>

    <div class="filter-row">
      <el-select v-model="filterCat" class="filter-select">
        <el-option v-for="c in CATEGORIES" :key="c" :label="c" :value="c" />
      </el-select>
      <el-select v-model="filterRange" class="filter-select">
        <el-option label="全部时间" value="全部时间" />
        <el-option label="本周内" value="本周内" />
        <el-option label="本月内" value="本月内" />
      </el-select>
    </div>

    <div class="stat-grid">
      <el-card class="stat-card">
        <div class="stat-label">活动总数</div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-sub">当前筛选范围内</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">累计报名人次</div>
        <div class="stat-value">{{ stats.totalSignup }}</div>
        <div class="stat-sub">名额总数 {{ filtered.reduce((s, a) => s + a.capacity, 0) }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">平均报名率</div>
        <div class="stat-value">{{ stats.fillRate }}%</div>
        <div class="stat-sub">报名人次 / 名额总数</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">已满员活动</div>
        <div class="stat-value">{{ stats.fullCount }}</div>
        <div class="stat-sub">报名人数达上限</div>
      </el-card>
    </div>

    <div class="chart-grid">
      <el-card class="chart-card">
        <template #header>
          <h3>热门活动报名人数</h3>
          <div class="chart-sub">按活动比较已报名人数</div>
        </template>
        <div ref="barEl" class="chart-box"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <h3>活动类别分布</h3>
          <div class="chart-sub">各类别活动数量占比</div>
        </template>
        <div ref="pieEl" class="chart-box"></div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filter-select {
  width: 160px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.stat-label {
  font-size: 13px;
  color: var(--ink-3);
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-top: 6px;
}
.stat-sub {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 4px;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}
.chart-card h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}
.chart-sub {
  font-size: 12px;
  color: var(--ink-3);
  margin-top: 4px;
}
.chart-box {
  width: 100%;
  min-height: 300px;
}
</style>
