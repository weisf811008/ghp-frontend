<template>
  <el-dialog v-model="isShow" title="修改帳號" @open="handleOpenDialog">
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
      <el-form-item label="角色名稱" prop="roles">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.roles"
          placeholder="選擇角色"
        >
          <el-option value="學校管理員" />
          <el-option value="巡檢人員" />
        </el-select>
      </el-form-item>
      <el-form-item label="使用者" prop="name">
        <el-input v-model="newData.name" placeholder="請輸入使用者" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="newData.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="newData.email" placeholder="請輸入Email" />
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
          @click.prevent="() => updateAdminUser(formRef)"
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
  roles: [],
  name: null,
  phone: null,
  email: null,
})

const handleOpenDialog = () => {
  newData.value = {
    roles: props.data.roles[0],
    name: props.data.name,
    phone: props.data?.phone,
    email: props.data?.email,
  }
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const updateAdminUser = (form) => {
  form.validate(async (valid, fields) => {
    if (valid && props.data) {
      try {
        const data = {
          roles: newData.value.roles,
          name: newData.value.name,
          phone: newData.value.phone,
          email: newData.value.email,
        }
        await props.update(props.data.id, data)
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
