<template>
  <el-table
    class="hidden-sm-and-down"
    :data="data"
    style="width: 100%"
    :default-expand-all="true"
  >
    <el-table-column label="項次" fixed align="center" width="60">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="檢核大項" prop="category" width="170" />
    <el-table-column label="檢核細項" prop="item" />
    <el-table-column
      label="測量值"
      prop="checkValue"
      align="center"
      width="90"
    />
    <el-table-column label="檢核結果" prop="status" align="center" width="230">
      <template #default="scope">
        <span
          :class="{
            pass: scope.row.status === 'pass',
            fail: scope.row.status === 'fail',
            others: scope.row.status === 'others',
          }"
        >
          {{ statusMap[scope.row.status] }}
        </span>
      </template>
    </el-table-column>
    <el-table-column type="expand">
      <template #default="scope">
        <div>
          <el-card>
            {{ scope.row.remarks }}
          </el-card>
        </div>
        <div>
          <AppPhotoWall :data="scope.row.files" @preview="handlePreivew" />
        </div>
      </template>
    </el-table-column>
  </el-table>
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
