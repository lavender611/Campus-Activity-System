<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ACTIVITIES, CATEGORIES } from '../store'

const router = useRouter()
const route = useRoute()
const formRef = ref()

// 支持从“活动管理”修改入口回显；无 id 则为新建
const editing = ACTIVITIES.find((x) => x.id === Number(route.query.id)) || null

const form = reactive({
  title: editing?.title || '',
  category: editing?.category || CATEGORIES[1],
  organizer: editing?.organizer || '',
  time: editing ? editing.startAt.replace(' ', 'T') : '',
  location: editing?.location || '',
  capacity: editing?.capacity || '',
  desc: editing?.desc || ''
})

// 表单校验规则：必填 + 名额正整数 + 活动时间不得早于当前时间
const validateTime = (_, value, callback) => {
  if (!value) return callback(new Error('请选择开始时间'))
  if (new Date(value) <= new Date()) return callback(new Error('活动时间不得早于当前时间'))
  callback()
}
const validateCapacity = (_, value, callback) => {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) return callback(new Error('名额须为不小于 1 的正整数'))
  callback()
}

const rules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  organizer: [{ required: true, message: '请输入主办方', trigger: 'blur' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  time: [{ validator: validateTime, trigger: 'change' }],
  capacity: [{ validator: validateCapacity, trigger: 'blur' }],
  desc: [{ required: true, message: '请填写活动简介', trigger: 'blur' }]
}

async function onSubmit() {
  await formRef.value.validate()
  const startAt = form.time.replace('T', ' ')
  const payload = {
    title: form.title.trim(),
    organizer: form.organizer.trim(),
    category: form.category,
    startAt,
    location: form.location.trim(),
    capacity: Number(form.capacity),
    desc: form.desc.trim()
  }

  if (editing) {
    Object.assign(editing, payload)
    ElMessage.success('活动信息已保存')
  } else {
    const newId = Math.max(...ACTIVITIES.map((x) => x.id)) + 1
    ACTIVITIES.push({ id: newId, signed: 0, status: 'signup-ongoing', ...payload })
    ElMessage.success('活动已发布')
  }
  router.push({ name: 'manage' })
}
</script>

<template>
  <div class="page-wrap">
    <div class="page-head">
      <h2>{{ editing ? '修改活动' : '发布活动' }}</h2>
      <p>{{ editing ? '调整活动信息后保存' : '填写活动信息，发布后进入活动管理列表' }}</p>
    </div>

    <el-card class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动名称" />
        </el-form-item>

        <el-row :gutter="14">
          <el-col :xs="24" :sm="12">
            <el-form-item label="活动类别">
              <el-select v-model="form.category" style="width:100%">
                <el-option v-for="c in CATEGORIES.filter((x) => x !== '全部')" :key="c" :label="c" :value="c" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="主办方" prop="organizer">
              <el-input v-model="form.organizer" placeholder="请输入主办方" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="14">
          <el-col :xs="24" :sm="12">
            <el-form-item label="开始时间" prop="time">
              <el-date-picker
                v-model="form.time"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DDTHH:mm"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="活动地点" prop="location">
              <el-input v-model="form.location" placeholder="请输入活动地点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="名额设置（人）" prop="capacity">
          <el-input-number v-model="form.capacity" :min="1" :step="1" placeholder="请输入正整数名额" style="width:100%" />
        </el-form-item>

        <el-form-item label="活动简介" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请填写活动内容、流程与注意事项" />
        </el-form-item>

        <div class="form-ops">
          <el-button type="primary" @click="onSubmit">{{ editing ? '保存修改' : '提交发布' }}</el-button>
          <el-button @click="router.push({ name: 'manage' })">返回列表</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.form-card {
  max-width: 720px;
}
.form-ops {
  display: flex;
  gap: 10px;
}
</style>
