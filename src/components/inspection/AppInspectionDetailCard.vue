<template>
  <el-card
    class="mb-card hidden-md-only hidden-lg-only hidden-xl-only"
    v-for="(row, index) in data"
    :key="`insp-mb-${row.id}`"
  >
    <el-descriptions :column="1">
      <el-descriptions-item label="#">
        {{ index + 1 }}
      </el-descriptions-item>
      <el-descriptions-item label="檢核大項">
        {{ row.category }}
      </el-descriptions-item>
      <el-descriptions-item label="檢核細項">
        {{ row.item }}
      </el-descriptions-item>
      <el-descriptions-item label="測量值">
        {{ row.checkValue }}
      </el-descriptions-item>
      <el-descriptions-item label="檢核結果">
        <span
          :class="{
            pass: row.status === 'pass',
            fail: row.status === 'fail',
            others: row.status === 'others',
          }"
        >
          {{ statusMap[row.status] }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item>
        <div>
          <el-card>
            {{ row.remarks }}
          </el-card>
        </div>
        <div>
          <AppPhotoWall :data="row.files" @preview="handlePreivew" />
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  statusMap: {
    type: Object,
    required: true,
  },
  previewFile: {
    type: Function,
  },
})

const emits = defineEmits(['previewFile'])

const handlePreivew = (uploadFile) => {
  emits('previewFile', uploadFile)
}
</script>
<style lang="scss" scoped>
:deep(div.el-upload.el-upload--picture-card) {
  display: none;
}
</style>
