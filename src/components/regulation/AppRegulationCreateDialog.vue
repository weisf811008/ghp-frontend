<template>
  <div>
    <el-dialog v-model="isShow" title="新增GHP條文" @open="handleOpenDialog">
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
            <el-option label="食品業者一般性規定" value="食品業者一般性規定" />
            <el-option
              label="餐飲與即時熟食業者專業性規定"
              value="餐飲與即時熟食業者專業性規定"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="類別序號" prop="code">
          <el-input v-model="newData.code" placeholder="請輸入類別序號" />
        </el-form-item>
        <el-form-item label="食品良好衛生規範法規GHP檢查" prop="description">
          <el-input
            v-model="newData.description"
            rows="5"
            type="textarea"
            placeholder="請輸入食品良好衛生規範法規GHP檢查內容"
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
            @click.prevent="closeDialog"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            @click.prevent="() => createRegulation(formRef)"
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
  class: '食品業者一般性規定',
  code: null,
  description: null,
})

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const createRegulation = (form) => {
  form.validate(async (valid, firlds) => {
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
<style lang="scss" scoped></style>
