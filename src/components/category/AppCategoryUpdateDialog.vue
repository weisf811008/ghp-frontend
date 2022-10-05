<template>
  <div>
    <el-dialog v-model="isShow" title="修改大項" @open="handleOpenDialog">
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
        <el-form-item prop="category">
          <el-input v-model="newData.category" placeholder="輸入大項" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="danger"
            text
            size="large"
            @click.prevent="closeDialog"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            @click.prevent="() => updateCategory(formRef)"
          >
            送出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
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
  category: null,
})

const handleOpenDialog = () => {
  newData.value = {
    category: props.data.category,
  }
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const updateCategory = async (form) => {
  form.validate(async (valid, fields) => {
    if (valid && props.data) {
      try {
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
