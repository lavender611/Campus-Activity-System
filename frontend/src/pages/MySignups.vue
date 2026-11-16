<script setup>
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ACTIVITIES, state, activityStatus } from '../store'

// 本人报名记录关联活动信息
const list = computed(() =>
  state.mySignups
    .map((signup) => ({ signup, activity: ACTIVITIES.find((x) => x.id === signup.activityId) }))
    .filter((x) => x.activity)
)

function dateShort(startAt) {
  const d = new Date(startAt.replace(' ', 'T'))
  return {
    mo: String(d.getMonth() + 1).padStart(2, '0'),
    dy: String(d.getDate()).padStart(2, '0')
  }
}

async function cancelSignup(activity) {
  try {
    await ElMessageBox.confirm('确定要取消该活动的报名吗？取消后名额将释放给其他同学。', '取消报名', {
      type: 'warning',
      confirmButtonText: '确认取消',
      cancelButtonText: '再想想'
    })
    state.mySignups = state.mySignups.filter((s) => s.activityId !== activity.id)
    if (activity.signed > 0) activity.signed -= 1
    ElMessage.success('已取消报名，名额已释放')
  } catch {
    // 取消弹窗
  }
}
</script>

<template>
  <div class="page-wrap">
    <div class="page-head">
      <h2>我的报名</h2>
      <p>查看本人报名记录，活动开始前可取消报名并释放名额</p>
    </div>

    <el-empty v-if="!list.length" description="你还没有报名任何活动，去「活动列表」看看吧" />

    <div class="mine-list">
      <el-card v-for="item in list" :key="item.signup.activityId" class="mine-item">
        <div class="mine-inner">
          <div class="date-block">
            <span class="mo">{{ dateShort(item.activity.startAt).mo }}月</span>
            <span class="dy">{{ dateShort(item.activity.startAt).dy }}</span>
          </div>
          <div class="mine-info">
            <div class="t-main">{{ item.activity.title }}</div>
            <div class="t-sub">报名时间：{{ item.signup.signupAt }}　·　{{ item.activity.location }}</div>
          </div>
          <div class="mine-side">
            <el-tag :type="activityStatus(item.activity).type" effect="light">{{ item.signup.status }}</el-tag>
            <el-button type="danger" plain size="small" @click="cancelSignup(item.activity)">取消报名</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.mine-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mine-inner {
  display: flex;
  gap: 16px;
  align-items: center;
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
.mine-info {
  flex: 1;
  min-width: 0;
}
.t-main {
  font-weight: 700;
  font-size: 15px;
}
.t-sub {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 3px;
}
.mine-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
@media (max-width: 768px) {
  .mine-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .mine-side {
    flex-direction: row;
    align-items: center;
  }
}
</style>
