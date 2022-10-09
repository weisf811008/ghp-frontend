<template>
  <div>
    <el-dialog v-model="isShow" title="修改學校" @open="handleOpenDialog">
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
            @click.prevent="() => updateSchool(formRef)"
            >送出
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
  // schoolId=null,
  name: null,
  city: null,
  address: null,
  phone: null,
  url: null,
})

const handleOpenDialog = () => {
  newData.value = {
    // schoolId: props.data.schoolId,
    name: props.data.name,
    city: props.data.city,
    address: props.data.address,
    phone: props.data?.phone,
    url: props.data?.url,
  }
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const updateSchool = (form) => {
  form.validate(async (valid, fields) => {
    if (valid && props.data) {
      try {
        const data = {
          // schoolId: newData.value.schoolId,
          name: newData.value.name,
          city: newData.value.city,
          address: newData.value.address,
          phone: newData.value.phone,
          url: newData.value.url,
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
