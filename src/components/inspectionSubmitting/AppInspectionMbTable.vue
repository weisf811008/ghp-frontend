<template>
  <el-table
    :ref="(el) => setMbTableRef(category, el)"
    :data="formDetailMap[category]"
    @expand-change="handleMbExpandChange"
    class="hidden-md-and-up"
    row-class-name="no-expand"
  >
    <el-table-column>
      <template #default="scope">
        <p style="font-size: var(--el-font-size-large)">
          {{ scope.$index + 1 }}. {{ scope.row.item }}
        </p>
        <el-input
          v-model="inspectionDetailMap[scope.row.itemId].checkValue"
          v-if="scope.row.needCheckValue"
          class="check-value"
          placeholder="測量值"
          size="large"
        />
        <el-form-item
          :error="uncheckedItems.includes(scope.row.itemId) ? '必填' : null"
          @change="() => handleDetailChange(scope.row.itemId)"
        >
          <el-radio-group
            v-model="inspectionDetailMap[scope.row.itemId].status"
            size="large"
          >
            <el-radio-button
              label="pass"
              value="pass"
              data-ghp-inspection-type="pass"
            >
              合格
            </el-radio-button>
            <el-radio-button
              label="fail"
              value="fail"
              data-ghp-inspection-type="fail"
            >
              不合格
            </el-radio-button>
            <el-radio-button
              label="others"
              value="others"
              data-ghp-inspection-type="others"
            >
              其他
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div class="remarks-button">
          <el-button
            size="large"
            class="remarks-button"
            :icon="mbExpandButtonIcon[`${scope.row.itemId}`]"
            @click.prevent="() => expandMbRow(category, scope.row)"
          >
            備註及附檔
          </el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="expand" width="1">
      <template #default="scope">
        <div>
          <el-input
            v-model="inspectionDetailMap[scope.row.itemId].remarks"
            prop="remarks"
            :rows="3"
            type="textarea"
            :key="`remarks-${scope.row.itemId}`"
            placeholder="請填寫備註"
          />
        </div>
        <div>
          <AppPhotoWall
            :data="inspectionDetailMap[scope.row.itemId].files"
            :uploadable="true"
            @preview="handleFilePreview"
            @success="(res) => handleUploaded(scope.row, res)"
            @remove="(file, files) => handleRemove(scope.row, file, files)"
          />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  formDetailMap: {
    type: Object,
    default: () => ({}),
  },
  handleMbExpandChange: {
    type: Function,
  },
  inspectionDetailMap: {
    type: Object,
    default: () => ({}),
  },
  uncheckedItems: {
    type: Array,
    required: true,
  },
  handleDetailChange: {
    type: Function,
  },
  handleFilePreview: {
    type: Function,
  },
  mbExpandButtonIcon: {
    type: Object,
    default: () => ({}),
  },
})

const mbTableRef = ref({})
const expandMbRow = (category, row) => {
  mbTableRef.value[category].toggleRowExpansion(row)
}

const setMbTableRef = (category, el) => {
  mbTableRef.value[category] = el
}

const handleUploaded = (row, res) => {
  props.inspectionDetailMap[row.itemId].files.push(res)
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
  .check-value {
    margin: 5px 0;
  }
  .remarks-button {
    width: 100%;
  }
  .el-radio-group {
    width: 100%;
    .el-radio-button {
      width: 100%;
      border: 0.1px solid rgb(220, 223, 230);
      border-radius: 4px;
      margin-top: 5px;
      :deep(.el-radio-button__inner) {
        width: 100%;
      }
    }
  }
}
</style>
