<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../api'
import { ElMessage } from 'element-plus'
const route=useRoute(), router=useRouter(), loading=ref(false)
const form=reactive({title:'',description:'',category:'学术讲座',location:'',startTime:'2026-12-20T09:00:00',endTime:'2026-12-20T12:00:00',capacity:100})
onMounted(async()=>{
  if(route.query.id){ try{const a=await api.activity(route.query.id); Object.assign(form,{...a,startTime:a.startTime?.slice(0,19),endTime:a.endTime?.slice(0,19)})}catch(e){ElMessage.error(e.message)}}
})
async function save(){
  if(!form.title.trim()||!form.location.trim()) return ElMessage.warning('请填写活动名称和地点')
  if(new Date(form.endTime)<=new Date(form.startTime)) return ElMessage.warning('结束时间必须晚于开始时间')
  loading.value=true
  try{
    const body={...form,capacity:Number(form.capacity)}
    const r=route.query.id?await api.updateActivity(route.query.id,body):await api.createActivity(body)
    if(r.success){ElMessage.success(r.message);router.push('/manage')}else ElMessage.error(r.message)
  }catch(e){ElMessage.error(e.message)}finally{loading.value=false}
}
</script>
<template>
  <main class="page">
    <div class="panel form-width">
      <h2>{{ route.query.id?'编辑活动':'发布活动' }}</h2>
      <el-form label-position="top">
        <el-form-item label="活动名称"><el-input v-model="form.title"/></el-form-item>
        <el-form-item label="活动描述"><el-input v-model="form.description" type="textarea" :rows="4"/></el-form-item>
        <el-form-item label="活动类别"><el-select v-model="form.category"><el-option v-for="c in ['学术讲座','文艺体育','志愿服务','社会实践']" :key="c" :label="c" :value="c"/></el-select></el-form-item>
        <el-form-item label="活动地点"><el-input v-model="form.location"/></el-form-item>
        <el-form-item label="开始时间"><el-date-picker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width:100%"/></el-form-item>
        <el-form-item label="结束时间"><el-date-picker v-model="form.endTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width:100%"/></el-form-item>
        <el-form-item label="报名名额"><el-input-number v-model="form.capacity" :min="1"/></el-form-item>
        <el-button type="primary" :loading="loading" @click="save">保存</el-button>
        <el-button @click="router.push('/manage')">返回</el-button>
      </el-form>
    </div>
  </main>
</template>
