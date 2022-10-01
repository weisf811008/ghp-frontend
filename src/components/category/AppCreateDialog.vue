<template>
  <div>
    <el-dialog v-model="isShow" title="新增大項" @open="handleOpenDialog">
      <el-form
        ref="formRef"
        :model="newData"
        :rules="rules"
        size="large"
        status-icon
        hide-required-asterisk
      >
        <el-form-item prop="category">
          <el-input v-model="newData.category" placeholder="輸入大項" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="danger"
          text
          size="large"
          class="cancel-button"
          @click.prevent="closeDialog"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click.prevent="() => createCategory(formRef)"
        >
          送出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  isLoading: Boolean,
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
  category: null,
})

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const createCategory = (form) => {
  form.validate(async (valid, fields) => {
    if (valid) {
      try {
        await props.create(newData.value)
        closeDialog()
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

<style lang="scss" scoped>
.cancel-button {
  margin-right: 10px;
}
</style>
