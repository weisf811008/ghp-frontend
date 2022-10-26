<template>
  <el-table
    :data="formDetailMap[category]"
    :row-class-name="setExpandRow"
    class="tableRow hidden-sm-and-down"
  >
    <el-table-column label="項次" align="center" width="60">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="檢核細項" prop="item" />
    <el-table-column
      label="測量值"
      prop="checkValue"
      align="center"
      width="100"
    >
      <template #default="scope">
        <el-input
          v-model="inspectionDetailMap[scope.row.itemId].checkValue"
          v-if="scope.row.needCheckValue"
          class="check-value"
          placeholder="測量值"
          size="large"
        />
      </template>
    </el-table-column>
    <el-table-column label="檢核結果" prop="status" align="center" width="230">
      <template #default="scope">
        <el-form-item
          :error="uncheckedItems.includes(scope.row.itemId) ? '必填' : null"
          @change="() => handleDetailChange(scope.row.itemId)"
        >
          <el-radio-group
            v-model="inspectionDetailMap[scope.row.itemId].status"
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
      </template>
    </el-table-column>
    <el-table-column type="expand">
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
const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  formDetailMap: {
    type: Object,
    default: () => ({}),
  },
  setExpandRow: {
    type: Function,
  },
  handleDetailChange: {
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
  handleFilePreview: {
    type: Function,
  },
  handleRemove: {
    type: Function,
  },
})

const handleUploaded = (row, res) => {
  props.inspectionDetailMap[row.itemId].files.push(res)
}
</script>

<style lang="scss" scoped>
.tableRow {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
@media screen and (max-width: 991px) {
  .check-value {
    margin: 5px 0;
  }
}
</style>
