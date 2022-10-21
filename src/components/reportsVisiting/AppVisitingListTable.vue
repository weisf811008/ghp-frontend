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
        <span :class="{ pass: scope.row.pass.length > 0 }">
          {{ scope.row.pass.length }}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="不合格次數"
      align="center"
      prop="status"
      width="100"
    >
      <template #default="scope">
        <span :class="{ fail: scope.row.fail.length > 0 }">
          {{ scope.row.fail.length }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="其他次數" align="center" prop="status" width="100">
      <template #default="scope">
        <span :class="{ others: scope.row.others.length > 0 }">
          {{ scope.row.others.length }}
        </span>
      </template>
    </el-table-column>
    <el-table-column type="expand" label="詳細說明" align="center" width="100">
      <template #default="scope">
        <el-descriptions>
          <el-descriptions-item label="合格項目：">
            <el-button
              class="item-button"
              type="success"
              text
              v-for="passItem in scope.row.pass"
              :key="`passItem-${passItem.date}-${passItem.inspectionId}-${passItem.formId}-${passItem.itemNo}`"
              @click.prevent="() => showCheckDrawer(passItem.inspectionId)"
            >
              {{
                `${passItem.date}(${passItem.itemNo} ${
                  passItem.remarks ? passItem.remarks : ''
                })`
              }}
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="不合格項目：">
            <el-button
              class="item-button"
              type="danger"
              text
              v-for="failItem in scope.row.fail"
              :key="`failItem-${failItem.date}-${failItem.inspectionId}-${failItem.formId}-${failItem.itemNo}`"
              @click.prevent="() => showCheckDrawer(failItem.inspectionId)"
            >
              {{
                `${failItem.date}(${failItem.itemNo} ${
                  failItem.remarks ? failItem.remarks : ''
                })`
              }}
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="其他項目：">
            <el-button
              class="item-button"
              type="warning"
              text
              v-for="othersItem in scope.row.others"
              :key="`othersItem-${othersItem.date}-${othersItem.inspectionId}-${othersItem.formId}-${othersItem.itemNo}`"
              @click.prevent="() => showCheckDrawer(othersItem.inspectionId)"
            >
              {{
                `${othersItem.date}(${othersItem.itemNo} ${
                  othersItem.remarks ? othersItem.remarks : ''
                })`
              }}
            </el-button>
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
  page: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['show'])

const showCheckDrawer = (id) => {
  emit('show', id)
}
</script>

<style lang="scss" scoped>
.item-button {
  margin: 0;
}
</style>
