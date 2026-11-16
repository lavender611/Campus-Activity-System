<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ACTIVITIES, CATEGORIES, activityStatus } from '../store'

const router = useRouter()

// 筛选条件
const keyword = ref('')
const filterCat = ref('全部')
const filterTime = ref('全部时间')
const sortBy = ref('time')

// 时间筛选：按活动开始时间与当前日期比较
function inTimeRange(startAt, range) {
  if (range === '全部时间') return true
  const now = new Date()
  const act = new Date(startAt.replace(' ', 'T'))
  const diffDays = (act - now) / 86400000
  if (range === '本周内') return diffDays >= -1 && diffDays <= 7
  if (range === '本月内') return diffDays >= -1 && diffDays <= 30
  return true
}

// 过滤 + 排序后的活动列表（计算属性，条件变化自动刷新）
const list = computed(() => {
  let arr = ACTIVITIES.filter((a) => {
    const matchCat = filterCat.value === '全部' || a.category === filterCat.value
    const kw = keyword.value.trim()
    const matchKw = !kw || a.title.includes(kw) || a.organizer.includes(kw) || a.location.includes(kw)
    const matchTime = inTimeRange(a.startAt, filterTime.value)
    return matchCat && matchKw && matchTime
  })
  if (sortBy.value === 'time') arr.sort((a, b) => a.startAt.localeCompare(b.startAt))
  if (sortBy.value === 'quota') arr.sort((a, b) => b.capacity - b.signed - (a.capacity - a.signed))
  if (sortBy.value === 'signed') arr.sort((a, b) => b.signed - a.signed)
  return arr
})

function dateShort(startAt) {
  const d = new Date(startAt.replace(' ', 'T'))
  return {
    mo: String(d.getMonth() + 1).padStart(2, '0'),
    dy: String(d.getDate()).padStart(2, '0')
  }
}

function openDetail(id) {
  router.push({ name: 'detail', params: { id } })
}
</script>

<template>
  <div class="page-wrap">
    <div class="page-head">
      <h2>活动列表</h2>
      <p>浏览校园活动，点击卡片查看详情并在线报名</p>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索活动名称、主办方或地点…"
        clearable
        class="search-input"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-select v-model="filterTime" class="time-select">
        <el-option label="全部时间" value="全部时间" />
        <el-option label="本周内" value="本周内" />
        <el-option label="本月内" value="本月内" />
      </el-select>
    </div>

    <div class="cat-row">
      <el-button
        v-for="c in CATEGORIES"
        :key="c"
        :type="filterCat === c ? 'primary' : 'default'"
        round
        @click="filterCat = c"
      >
        {{ c }}
      </el-button>
    </div>

    <div class="sort-row">
      <span>排序：</span>
      <el-select v-model="sortBy" class="sort-select">
        <el-option label="按开始时间" value="time" />
        <el-option label="剩余名额从多到少" value="quota" />
        <el-option label="报名人数从多到少" value="signed" />
      </el-select>
      <span class="count">共 {{ list.length }} 场活动</span>
    </div>

    <el-empty v-if="!list.length" description="没有符合条件的活动，换个关键词或筛选试试" />

    <div class="activity-grid">
      <el-card
        v-for="a in list"
        :key="a.id"
        class="activity-card"
        shadow="hover"
        @click="openDetail(a.id)"
      >
        <div class="card-top">
          <div class="date-block">
            <span class="mo">{{ dateShort(a.startAt).mo }}月</span>
            <span class="dy">{{ dateShort(a.startAt).dy }}</span>
          </div>
          <div class="card-body">
            <div class="card-title">{{ a.title }}</div>
            <div class="card-meta">
              <div class="meta-line"><el-icon><OfficeBuilding /></el-icon>{{ a.organizer }}</div>
              <div class="meta-line"><el-icon><Clock /></el-icon>{{ a.startAt }}</div>
              <div class="meta-line"><el-icon><Location /></el-icon>{{ a.location }}</div>
            </div>
          </div>
        </div>
        <div class="card-foot">
          <span class="quota">剩余名额 <b>{{ a.capacity - a.signed }}</b> / {{ a.capacity }}</span>
          <el-tag :type="activityStatus(a).type" effect="light">{{ activityStatus(a).text }}</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.search-input {
  flex: 1;
}
.time-select {
  width: 130px;
}
.cat-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.sort-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--ink-2);
}
.sort-select {
  width: 170px;
}
.count {
  margin-left: auto;
  color: var(--ink-3);
}
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.activity-card {
  cursor: pointer;
}
.card-top {
  display: flex;
  gap: 14px;
}
.date-block {
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #e8f1fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #1b4c84;
}
.date-block .mo {
  font-size: 11px;
  font-weight: 600;
}
.date-block .dy {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.1;
}
.card-body {
  flex: 1;
  min-width: 0;
}
.card-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 5px;
}
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.meta-line {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: var(--ink-2);
}
.meta-line .el-icon {
  color: var(--ink-3);
}
.card-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #edf1f6;
}
.quota {
  font-size: 13px;
  color: var(--ink-2);
}
@media (max-width: 768px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
