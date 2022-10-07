<template>
  <el-dialog v-model="isShow" title="新增帳號" @open="handleOpenDialog">
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
      <el-form-item label="角色名稱" prop="role">
        <el-select
          class="formSelect"
          size="large"
          v-model="newData.role"
          placeholder="選擇角色"
        >
          <el-option value="學校管理員" />
          <el-option value="巡檢人員" />
        </el-select>
      </el-form-item>
      <el-form-item label="使用者" prop="name">
        <el-input v-model="newData.name" placeholder="請輸入使用者" />
      </el-form-item>
      <el-form-item label="帳號" prop="username">
        <el-input v-model="newData.username" placeholder="請輸入帳號" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input
          v-model="newData.password"
          type="password"
          autocomplete="off"
          placeholder="請輸入密碼"
        />
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
          @click.prevent="() => createUser(formRef)"
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
    defualt: false,
  },
  isLoading: {
    type: Boolean,
    defualt: false,
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
  role: [],
  name: null,
  username: null,
  password: null,
  phone: null,
  email: null,
})

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const createUser = (form) => {
  form.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = {
          roles: [newData.value.role],
          name: newData.value.name,
          username: newData.value.username,
          password: newData.value.password,
          phone: newData.value.phone,
          email: newData.value.email,
        }
        await props.create(data)
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

<style lang="scss" scoped></style>
