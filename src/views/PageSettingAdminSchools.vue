<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>學校管理</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增學校
        </el-button>
      </div>
    </template>
    <AppAdminSchoolListTable
      :schools="schools"
      :isLoading="isLoading"
      :delete="deleteSchool"
      @update="showUpdateDialog"
    />
    <AppAdminSchoolCreate
      v-model:show="isShowCreateDialog"
      :isLoading="isLoading"
      :rules="rules"
      :create="createSchool"
    />
    <AppAdminSchoolUpdate
      v-model:show="isShowUpdateDialog"
      :data="school"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateSchool"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminSchoolStore } from '../stores/adminSchool'
import AppAdminSchoolListTable from '../components/adminSchool/AppAdminSchoolListTable.vue'
import AppAdminSchoolCreate from '../components/adminSchool/AppAdminSchoolCreate.vue'
import AppAdminSchoolUpdate from '../components/adminSchool/AppAdminSchoolUpdate.vue'

const schoolStore = useAdminSchoolStore()
const { schools, isLoading } = storeToRefs(schoolStore)
const { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool } =
  schoolStore

const school = ref({})
const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)

const showCreateDialog = () => {
  isShowCreateDialog.value = true
}

const showUpdateDialog = async (id) => {
  school.value = await getSchoolById(id)
  isShowUpdateDialog.value = true
}

const rules = reactive({
  code: [
    { required: true, message: '此欄位不得為空', trigger: ['blur', 'change'] },
    { max: 10, message: '最多10個字元' },
  ],
  name: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  city: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 20, message: '最多20個字元' },
  ],
  address: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  phone: [{ max: 50, message: '最多50個字元' }],
  url: [{ max: 255, message: '最多255個字元' }],
})

onMounted(() => {
  getSchools()
})
</script>

<style lang="scss" scoped></style>
