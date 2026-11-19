<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'
import { toPickerValue } from '../format'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const isEdit = computed(() => Boolean(route.query.id))

const CATEGORIES = ['学术讲座', '文艺体育', '志愿服务', '社会实践']

const form = reactive({
  title: '',
  description: '',
  category: '学术讲座',
  location: '',
  startTime: '2026-12-20T09:00:00',
  endTime: '2026-12-20T12:00:00',
  capacity: 100
})

onMounted(async () => {
  if (!route.query.id) return
  try {
    const a = await api.activity(route.query.id)
    Object.assign(form, {
      title: a.title ?? '',
      description: a.description ?? '',
      category: a.category || '学术讲座',
      location: a.location ?? '',
      startTime: toPickerValue(a.startTime),
      endTime: toPickerValue(a.endTime),
      capacity: a.capacity ?? 100
    })
  } catch (e) {
    ElMessage.error(e.message)
  }
})

function validate() {
  if (!form.title.trim()) return '请填写活动名称'
  if (!form.location.trim()) return '请填写活动地点'
  if (!CATEGORIES.includes(form.category)) return '请选择活动类别'
  if (!form.startTime || !form.endTime) return '请选择开始时间和结束时间'
  if (new Date(form.endTime) <= new Date(form.startTime)) return '结束时间必须晚于开始时间'
  if (!form.capacity || Number(form.capacity) < 1) return '报名名额至少为 1'
  return ''
}

async function save() {
  const error = validate()
  if (error) return ElMessage.warning(error)
  loading.value = true
  try {
    // 只提交后端需要的字段，避免把 id / registeredCount 等只读字段回传
    const body = {
      title: form.title.trim(),
      description: form.description,
      category: form.category,
      location: form.location.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
      capacity: Number(form.capacity)
    }
    const r = isEdit.value
      ? await api.updateActivity(route.query.id, body)
      : await api.createActivity(body)
    if (r.success) {
      ElMessage.success(r.message)
      router.push('/manage')
    } else {
      ElMessage.error(r.message)
    }
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <div class="panel form-width">
      <h2>{{ isEdit ? '编辑活动' : '发布活动' }}</h2>
      <el-form label-position="top" @submit.prevent="save">
        <el-form-item label="活动名称">
          <el-input v-model="form.title" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="form.description" type="textarea" :rows="4" maxlength="2000" show-word-limit />
        </el-form-item>
        <el-form-item label="活动类别">
          <el-select v-model="form.category" style="width:100%">
            <el-option v-for="c in CATEGORIES" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动地点">
          <el-input v-model="form.location" maxlength="150" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="请选择开始时间"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="请选择结束时间"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="报名名额">
          <el-input-number v-model="form.capacity" :min="1" :max="100000" />
        </el-form-item>
        <el-button type="primary" :loading="loading" @click="save">保存</el-button>
        <el-button @click="router.push('/manage')">返回</el-button>
      </el-form>
    </div>
  </main>
</template>
