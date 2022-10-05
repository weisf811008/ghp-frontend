<template>
  <el-dialog v-model="isShow" title="新增訪視表條文" @open="handleOpenDialog">
    <el-form
      ref="formRef"
      :model="newData"
      :disabled="isLoading"
      :rules="rules"
      size="large"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="類別" prop="class">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.class"
          placeholder="選擇類別"
        >
          <el-option label="衛生訪視內容" value="衛生訪視內容" />
        </el-select>
      </el-form-item>
      <el-form-item label="編號" prop="code">
        <el-input v-model="newData.code" placeholder="請輸入編號" />
      </el-form-item>
      <el-form-item label="訪視項目" prop="description">
        <el-input
          v-model="newData.description"
          rows="5"
          type="textarea"
          placeholder="請輸入訪視項目"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button
          type="danger"
          text
          size="large"
          class="cancel-button"
          @click.prevent="CloseDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click.prevent="() => createVisitingForm(formRef)"
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
  isLoading: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    required: true,
  },
  create: {
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
  class: '衛生訪視內容',
  code: null,
  description: null,
})

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const CloseDialog = () => {
  emit('update:show', false)
}

const createVisitingForm = (form) => {
  form.validate(async (valid, firlds) => {
    if (valid) {
      try {
        await props.create(newData.value)
        CloseDialog()
        ElNotification({
          type: 'success',
          message: '新增成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '新增失敗',
        })
      }
    }
  })
}
</script>
<style lang="scss" scoped></style>
