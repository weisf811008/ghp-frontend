<template>
  <el-drawer
    v-model="isShow"
    title="查看巡檢紀錄"
    :size="isMobile ? '100%' : '80%'"
  >
    <el-descriptions border :column="isMobile ? 1 : 2" class="form-header">
      <el-descriptions-item label="表單名稱">
        {{ inspection.title }}
      </el-descriptions-item>
      <el-descriptions-item label="巡檢日期">
        {{ inspection.date && format(parseISO(inspection.date), 'yyyy/MM/dd') }}
      </el-descriptions-item>
      <el-descriptions-item label="限期改善日期">
        {{
          inspection.dueDate &&
          format(parseISO(inspection.dueDate), 'yyyy/MM/dd')
        }}
      </el-descriptions-item>
      <el-descriptions-item label="巡檢人員">
        {{ inspection.inspectedBy?.name }}
      </el-descriptions-item>
      <el-descriptions-item label="填報時間">
        {{
          inspection.createdAt &&
          format(parseISO(inspection.createdAt), 'yyyy/MM/dd HH:mm')
        }}
      </el-descriptions-item>
      <el-descriptions-item label="備註">
        {{ inspection.remarks }}
      </el-descriptions-item>
    </el-descriptions>
    <AppInspectionDetailTable
      :data="inspection.details"
      :statusMap="statusMap"
      @previewFile="handleFilePreivew"
    />
    <AppInspectionDetailCard
      :data="inspection.details"
      :statusMap="statusMap"
      @previewFile="handleFilePreivew"
    />
    <AppPreviewDialog
      v-model:show="isShowPreview"
      :uploadFile="previewUploadFile"
    />
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
import { useMenuStore } from '../stores/menu'
import textFilesSvgUrl from '../assets/undraw_text_files_au1q.svg?url'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  inspection: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:show'])

const menuStore = useMenuStore()
const { isMobile } = storeToRefs(menuStore)

const isShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const isShowPreview = ref(false)
const previewUploadFile = ref({})

const statusMap = {
  pass: '合格',
  fail: '不合格',
  others: '其他',
}

const handleFilePreivew = (uploadFile) => {
  previewUploadFile.value = uploadFile
  isShowPreview.value = true
}
</script>

<style lang="scss" scoped>
.form-header {
  margin-bottom: 10px;
}
</style>
