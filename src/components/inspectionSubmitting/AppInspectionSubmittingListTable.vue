<template>
  <el-form
    ref="submitFormRef"
    :model="theNewData"
    v-loading="isLoading"
    :rules="rules"
    status-icon
  >
    <div class="subtitle">
      <h3>{{ form.title }}</h3>
      <el-form-item label="巡檢日期" prop="date">
        <AppInspectionDate
          :dateData="theNewData.date"
          :disabled-date="disabledDate"
          @update:dateData="(val) => handleNewDataUpdate('date', val)"
        />
      </el-form-item>
    </div>
    <el-card
      v-for="category in Object.keys(formDetailMap)"
      :key="category"
      class="mb-card-table"
    >
      <template #header>
        <div class="inspect-header">
          <div
            class="category-name"
            style="font-size: var(--el-font-size-large)"
          >
            {{ category }}
          </div>
          <div>
            <el-button
              class="check-all"
              icon="Select"
              size="large"
              @click.prevent="() => inspectInBatch(category)"
            >
              一鍵檢核
            </el-button>
          </div>
        </div>
      </template>
      <AppInspectionTable
        :inspectionDetailMap="theInspMap"
        :category="category"
        :formDetailMap="formDetailMap"
        :setExpandRow="setExpandRow"
        :handleInspChange="handleInspChange"
        :handleFileUpload="handleFileUpload"
        :handleFileRemove="handleFileRemove"
        :handleDetailChange="handleDetailChange"
        :handleFilePreview="handleFilePreview"
        :uncheckedItems="uncheckedItems"
      />
      <AppInspectionMbTable
        :inspectionDetailMap="inspectionDetailMap"
        :category="category"
        :formDetailMap="formDetailMap"
        :handleMbExpandChange="handleMbExpandChange"
        :handleInspChange="handleInspChange"
        :handleFileUpload="handleFileUpload"
        :handleFileRemove="handleFileRemove"
        :uncheckedItems="uncheckedItems"
        :handleFilePreview="handleFilePreview"
        :handleDetailChange="handleDetailChange"
        :mbExpandButtonIcon="mbExpandButtonIcon"
      />
    </el-card>
    <div>
      <el-input
        :model-value="theNewData.remarks"
        @input="(val) => handleNewDataUpdate('remarks', val)"
        rows="2"
        type="textarea"
        placeholder="請輸入備註"
      />
      <div class="footer">
        <div class="due-date">
          <el-form-item label="限期改善" prop="dueDate">
            <AppInspectionDate
              :dateData="theNewData.dueDate"
              :disabled-date="disabledDueDate"
              @update:dateData="(val) => handleNewDataUpdate('dueDate', val)"
            />
          </el-form-item>
        </div>
        <div class="footer-button">
          <el-button
            type="danger"
            size="large"
            text
            class="cancel-button"
            @click.prevent="closeInspectForm"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            class="submit-button"
            @click.prevent="() => handleSubmitInspectForm(submitFormRef)"
          >
            送出
          </el-button>
        </div>
      </div>
    </div>
  </el-form>
  <AppPreviewDialog
    v-model:show="isShowPreview"
    :uploadFile="previewUploadFile"
  />
</template>

<script setup>
import axios from 'axios'
import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    required: true,
  },
  newData: {
    type: Object,
    required: true,
  },
  create: {
    type: Function,
  },
  formDetailMap: {
    type: Object,
    default: () => ({}),
  },
  inspectionDetailMap: {
    type: Object,
    default: () => ({}),
  },
  mbExpandButtonIcon: {
    type: Object,
    default: () => ({}),
  },
  handleMbExpandChange: {
    type: Function,
  },
})

const emits = defineEmits(['update:inspectionDetailMap', 'update:newData'])

const router = useRouter()
const submitFormRef = ref()

const theInspMap = computed({
  get: () => props.inspectionDetailMap,
  set: (val) => emits('update:inspectionDetailMap', val),
})

const theNewData = computed({
  get: () => props.newData,
  set: (val) => emits('update:newData', val),
})

const inspectInBatch = (category) => {
  theInspMap.value = merge(
    theInspMap.value,
    props.formDetailMap[category].reduce((acc, cur) => {
      if (!theInspMap.value[cur.itemId].status) {
        acc[cur.itemId] = {
          status: 'pass',
        }
      }
      return acc
    }, {})
  )
}

const closeInspectForm = () => {
  router.push({ name: 'Inspection' })
}

const handleNewDataUpdate = (attr, val) => {
  theNewData.value = merge(theNewData.value, {
    [attr]: val,
  })
}

const handleInspChange = (attr, itemId, val) => {
  theInspMap.value = merge(theInspMap.value, {
    [itemId]: {
      [attr]: val,
    },
  })
}

const handleFileUpload = (itemId, res) => {
  theInspMap.value = merge(theInspMap.value, {
    [itemId]: {
      files: theInspMap.value[itemId].files.concat(res),
    },
  })
}

const handleFileRemove = (itemId, file) => {
  theInspMap.value = mergeWith(
    theInspMap.value,
    {
      [itemId]: {
        files: theInspMap.value[itemId].files.filter(
          (f) => f.filename !== file.filename
        ),
      },
    },
    (obj, src) => {
      if (Array.isArray(src)) {
        return src
      }
    }
  )
}

const handleDetailChange = (itemId) => {
  uncheckedItems.value = uncheckedItems.value.filter((a) => a !== itemId)
}

const handleSubmitInspectForm = async (formRef) => {
  formRef.validate(async (valid, fields) => {
    props.newData.details = Object.values(props.inspectionDetailMap)
    uncheckedItems.value = props.newData.details
      .filter((d) => !d.status)
      .map((d) => d.itemId)
    if (valid && uncheckedItems.value.length === 0) {
      try {
        await props.create({
          ...props.newData,
          date: new Date(props.newData.date).toISOString(),
          dueDate:
            props.newData.dueDate &&
            new Date(props.newData.dueDate).toISOString(),
        })
        router.push({ name: 'Inspection' })
      } catch (e) {
        console.error(e)
        const msg =
          axios.isAxiosError(e) && e.response.status === 422
            ? e.response.data.errors
                .map((err) => `${err.param}${err.msg}`)
                .join('、')
            : '發生錯誤'
        ElNotification({
          type: 'error',
          title: '新增巡檢紀錄失敗',
          message: msg,
        })
      }
    }
  })
}
const uncheckedItems = ref([])

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const disabledDueDate = (time) => {
  return time.getTime() < Date.now()
}

const setExpandRow = ({ row, rowIndex }) => {
  const detail = props.inspectionDetailMap[row.itemId]
  const item = props.form.details.find((d) => d.itemId === row.itemId)
  return detail.status === 'pass' && !item.needCheckValue ? 'no-expand' : null
}

const handleRemove = (row, uploadFile, uploadFiles) => {
  props.inspectionDetailMap[row.itemId].files = props.inspectionDetailMap[
    row.itemId
  ].files.filter((p) => p.filename !== uploadFile.url.split('/').pop())
}

const previewUploadFile = ref({})
const isShowPreview = ref(false)

const handleFilePreview = (uploadFile) => {
  previewUploadFile.value = uploadFile
  isShowPreview.value = true
}
</script>

<style lang="scss" scoped>
.subtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inspect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-card-table {
  margin-bottom: 6px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  margin-top: 20px;

  .footer-button {
    display: flex;
    margin-top: -20px;

    .cancel-button {
      display: block;
    }
  }
}

:deep(tr.no-expand > td.el-table__expand-column > div.cell) {
  display: none;
}

:deep(.el-radio-button__inner:hover) {
  color: var(--el-text-color-regular);
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  color: white;
}

:deep(.el-radio-button.is-active[data-ghp-inspection-type='pass']
    .el-radio-button__inner) {
  background: var(--el-color-success);
  border: 1px solid var(--el-color-success);
}

:deep(.el-radio-button.is-active[data-ghp-inspection-type='fail']
    .el-radio-button__inner) {
  background: var(--el-color-danger);
  border: 1px solid var(--el-color-danger);
}

:deep(.el-radio-button.is-active[data-ghp-inspection-type='others']
    .el-radio-button__inner) {
  background: var(--el-color-warning);
  border: 1px solid var(--el-color-warning);
}

:deep(.el-form-item.is-success.is-no-asterisk.el-form-item--feedback) {
  margin: 0;
}

@media screen and (max-width: 991px) {
  .box-card {
    .subtitle {
      display: block;
      margin: 0 auto 10px auto;

      h3 {
        margin: 0 auto 10px 0;
      }
    }

    .inspect-header {
      display: block;

      .category-name {
        margin-bottom: 10px;
        text-align: center;
      }
      .check-all {
        width: 100%;
      }
    }

    .footer {
      display: block;
    }

    .due-date {
      margin-bottom: 40px;
    }

    .footer-button {
      width: 100%;

      .cancel-button {
        background-color: #f0f2f5;
        width: 50%;
      }

      .submit-button {
        width: 50%;
      }
    }
  }
}
</style>
