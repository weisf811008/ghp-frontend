<template>
  <el-table :data="tableData" v-loading="isLoading" table-layout="auto">
    <el-table-column label="項次" fixed align="center" width="60">
      <template #default="scope">
        {{ scope.$index + (page - 1) * pageSize + 1 }}
      </template>
    </el-table-column>
    <el-table-column
      label="類別"
      fixed
      align="center"
      prop="code"
      width="100"
    />
    <el-table-column
      label="編號"
      fixed
      align="center"
      prop="class"
      width="170"
    />
    <el-table-column
      label="訪視項目"
      fixed
      prop="description"
      min-width="400"
    />
    <el-table-column label="合格次數" align="center" prop="status" width="100">
      <template #default="scope">
        {{ scope.row.pass.length }}
      </template>
    </el-table-column>
    <el-table-column
      label="不合格次數"
      align="center"
      prop="status"
      width="100"
    >
      <template #default="scope">
        {{ scope.row.fail.length }}
      </template>
    </el-table-column>
    <el-table-column label="其他次數" align="center" prop="status" width="100">
      <template #default="scope">
        {{ scope.row.others.length }}
      </template>
    </el-table-column>
    <el-table-column type="expand" label="詳細說明" align="center" width="100">
      <template #default="scope">
        <el-descriptions>
          <el-descriptions-item label="合格項目：">
            {{ scope.row.pass.map(getStatusDetail).join(', ') }}
          </el-descriptions-item>
          <el-descriptions-item label="不合格項目：">
            {{ scope.row.fail.map(getStatusDetail).join(', ') }}
          </el-descriptions-item>
          <el-descriptions-item label="其他項目：">
            {{ scope.row.others.map(getStatusDetail).join(', ') }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  getStatusDetail: {
    type: Function,
  },
  page: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
})
</script>

<style lang="scss" scoped></style>
