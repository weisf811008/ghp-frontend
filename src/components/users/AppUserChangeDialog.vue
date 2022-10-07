<template>
  <el-dialog v-model="isShow" title="重設密碼" @open="handleOpenDialog">
    <div style="margin-bottom: 20px">
      重設
      <span class="showUserData"> {{ data.name }}({{ data.username }}) </span>
      的密碼
    </div>
    <el-form
      ref="formRef"
      :model="changeData"
      :rules="rules"
      size="large"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="新密碼" prop="password">
        <el-input
          v-model="changeData.password"
          type="password"
          autocomplete="off"
          placeholder="請輸入新密碼"
        />
      </el-form-item>
      <el-form-item label="確認密碼" prop="confirmPassword">
        <el-input
          v-model="changeData.confirmPassword"
          type="password"
          autocomplete="off"
          placeholder="請再輸入一次密碼"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text size="large" @click.prevent="closeDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click.prevent="() => changePassword(formRef)"
        >
          送出
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
  reset: {
    type: Function,
  },
})

const emit = defineEmits(['update:show'])

const isShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const formRef = ref()
const changeData = ref({
  password: null,
  confirmPassword: null,
})

const rules = {
  password: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 100, message: '最多100個字元', trigger: 'blur' },
    { min: 6, message: '至少6個字元', trigger: 'blur' },
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (value !== changeData.value.password) {
          callback(new Error('密碼輸入錯誤'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const changePassword = (form) => {
  form.validate(async (valid, fields) => {
    if (valid && props.data) {
      try {
        await props.reset(props.data.id, changeData.value.password)
        closeDialog()
        ElNotification({
          type: 'success',
          message: '重設密碼成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '重設密碼失敗',
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.showUserData {
  font-weight: bold;
}
</style>
