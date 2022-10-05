<template>
  <el-dialog v-model="isShow" title="修改細項" @open="handleOpenDialog">
    <el-form
      ref="formRef"
      :model="newData"
      :rules="rules"
      :disabled="isLoading"
      size="large"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="編號" prop="no">
        {{ newData.no }}
      </el-form-item>
      <el-form-item label="檢核大項" prop="categoryId">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.categoryId"
          placeholder="選擇大項"
        >
          <el-option
            v-for="category in categories"
            :value="category.id"
            :label="category.category"
            :key="`select-category-${category.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="檢核細項" prop="item">
        <el-input
          v-model="newData.item"
          rows="2"
          type="textarea"
          placeholder="請輸入檢核細項"
        />
      </el-form-item>
      <el-form-item label="週期" prop="period">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.period"
          placeholder="請選擇或輸入週期"
        >
          <el-option
            v-for="period in periods"
            :value="period"
            :label="period"
            :key="`update-select-period-${period}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="區域" prop="area">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.area"
          placeholder="請選擇或輸入區域"
        >
          <el-option
            v-for="area in areas"
            :value="area"
            :label="area"
            :key="`update-select-area-${area}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="GHP條文" prop="regulations">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.regulations"
          multiple
          placeholder="請選擇GHP條文"
        >
          <el-option
            v-for="regulation in regulations"
            :value="regulation.id"
            :label="regulation.code"
            :key="`update-select-regulation-${regulation.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="訪視表條文" prop="visitingForms">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.visitingForms"
          multiple
          placeholder="請選擇訪視表條文"
        >
          <el-option
            v-for="visitingForm in visitingForms"
            :value="visitingForm.id"
            :label="visitingForm.code"
            :key="`update-select-visitingForm-${visitingForm.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需填資料" prop="needCheckValue">
        <el-radio-group v-model="newData.needCheckValue">
          <el-radio :label="true">需要</el-radio>
          <el-radio :label="false">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每日衛生管理日誌" prop="needDaily">
        <el-radio-group v-model="newData.needDaily">
          <el-radio :label="true">列入</el-radio>
          <el-radio :label="false">不列入</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="danger"
          text
          size="large"
          class="cancel-button"
          @click.prevent="closeDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click.prevent="() => updateItem(formRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  periods: {
    type: Array,
    default: [],
  },
  areas: {
    type: Array,
    default: [],
  },
  regulations: {
    type: Array,
    default: [],
  },
  visitingForms: {
    type: Array,
    default: [],
  },
  update: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:show'])

const isShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const formRef = ref()
const newData = ref({
  categoryId: null,
  no: null,
  item: null,
  period: null,
  area: null,
  regulations: [],
  visitingForms: [],
  needCheckValue: true,
  needDaily: true,
})

const handleOpenDialog = () => {
  newData.value = {
    categoryId: props.data.categoryId,
    no: props.data.no,
    item: props.data.item,
    period: props.data.period,
    area: props.data.area,
    regulations: props.data.regulations || [],
    visitingForms: props.data.visitingForms || [],
    needCheckValue: props.data.needCheckValue,
    needDaily: props.data.needDaily,
  }
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const updateItem = (form) => {
  form.validate(async (valid, fields) => {
    if (valid && props.data) {
      try {
        const data = {
          categoryId: newData.value.categoryId,
          no: newData.value.no,
          item: newData.value.item,
          period: newData.value.period,
          area: newData.value.area,
          regulations: newData.value.regulations,
          visitingForms: newData.value.visitingForms,
          needCheckValue: newData.value.needCheckValue,
          needDaily: newData.value.needDaily,
        }
        await props.update(props.data.id, newData.value)
        closeDialog()
        ElNotification({
          type: 'success',
          message: '修改成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '修改失敗',
        })
      }
    }
  })
}
</script>
<style lang="scss" scoped></style>
