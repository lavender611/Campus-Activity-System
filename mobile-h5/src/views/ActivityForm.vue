<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'
import { toast } from '../ui'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const categories = ['学术讲座', '文艺体育', '志愿服务', '社会实践']

const form = reactive({
  title: '',
  description: '',
  category: '学术讲座',
  location: '',
  startTime: '2026-12-20T09:00',
  endTime: '2026-12-20T12:00',
  capacity: 100
})

function withSeconds(value) {
  if (!value) return value
  return String(value).length === 16 ? `${value}:00` : value
}

onMounted(async () => {
  if (!route.query.id) return
  try {
    const a = await api.activity(route.query.id)
    Object.assign(form, {
      title: a.title || '',
      description: a.description || '',
      category: a.category || '学术讲座',
      location: a.location || '',
      startTime: a.startTime ? a.startTime.slice(0, 16) : form.startTime,
      endTime: a.endTime ? a.endTime.slice(0, 16) : form.endTime,
      capacity: Number(a.capacity) || 1
    })
  } catch (e) {
    toast.error(e.message)
  }
})

async function save() {
  if (!form.title.trim() || !form.location.trim()) return toast.warning('请填写活动名称和地点')
  if (new Date(withSeconds(form.endTime)) <= new Date(withSeconds(form.startTime))) {
    return toast.warning('结束时间必须晚于开始时间')
  }
  loading.value = true
  try {
    const body = {
      title: form.title.trim(),
      description: form.description,
      category: form.category,
      location: form.location.trim(),
      startTime: withSeconds(form.startTime),
      endTime: withSeconds(form.endTime),
      capacity: Number(form.capacity)
    }
    const r = route.query.id
      ? await api.updateActivity(route.query.id, body)
      : await api.createActivity(body)
    if (r.success) {
      toast.success(r.message)
      router.push('/manage')
    } else {
      toast.error(r.message)
    }
  } catch (e) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div class="field">
        <label class="field-label">活动名称</label>
        <input v-model="form.title" type="text" placeholder="例如：人工智能前沿讲座" />
      </div>

      <div class="field">
        <label class="field-label">活动描述</label>
        <textarea v-model="form.description" placeholder="简要说明活动内容、流程与注意事项"></textarea>
      </div>

      <div class="field">
        <label class="field-label">活动类别</label>
        <select v-model="form.category">
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field">
        <label class="field-label">活动地点</label>
        <input v-model="form.location" type="text" placeholder="例如：图书馆报告厅" />
      </div>

      <div class="field">
        <label class="field-label">开始时间</label>
        <input v-model="form.startTime" type="datetime-local" />
      </div>

      <div class="field">
        <label class="field-label">结束时间</label>
        <input v-model="form.endTime" type="datetime-local" />
      </div>

      <div class="field">
        <label class="field-label">报名名额</label>
        <input v-model.number="form.capacity" type="number" min="1" inputmode="numeric" />
        <div class="field-hint">名额为可报名人数上限，达到上限后学生无法再报名</div>
      </div>

      <button type="button" class="btn btn-primary btn-block" :disabled="loading" @click="save">
        {{ loading ? '保存中…' : '保存' }}
      </button>
      <button type="button" class="btn btn-ghost btn-block" style="margin-top: 10px" @click="router.push('/manage')">返回管理列表</button>
    </div>
  </div>
</template>
