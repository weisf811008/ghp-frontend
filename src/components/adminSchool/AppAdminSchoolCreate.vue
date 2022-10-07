<template>
  <el-dialog v-model="isShow" title="新增學校" @open="handleOpenDialog">
    <el-form
      ref="formRef"
      :model="newData"
      :rules="rules"
      size="large"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="學校代碼" prop="code">
        <el-input v-model="newData.code" placeholder="請輸入學校代碼" />
      </el-form-item>
      <el-form-item label="學校名稱" prop="name">
        <el-input v-model="newData.name" placeholder="請輸入學校名稱" />
      </el-form-item>
      <el-form-item label="縣(市)" prop="city">
        <el-input v-model="newData.city" placeholder="請輸入縣(市)" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="newData.address" placeholder="請輸入地址" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="newData.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="newData.url" placeholder="請輸入URL" />
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
          @click.prevent="() => createSchool(formRef)"
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
  schools: {
    type: Array,
    default: [],
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
  },
})

const emit = defineEmits(['update:show'])

const isShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const formRef = ref()
const newData = ref({
  code: null,
  name: null,
  city: null,
  address: null,
  phone: null,
  url: null,
})

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const createSchool = (form) => {
  form.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = {
          code: newData.value.code,
          name: newData.value.name,
          city: newData.value.city,
          address: newData.value.address,
          phone: newData.value.phone,
          url: newData.value.url,
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
