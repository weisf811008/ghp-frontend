<template>
  <div>
    <el-dialog v-model="isShow" title="修改訪視表條文" @open="handleOpenDialog">
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
        <el-form-item label="編號" prop="code">
          {{ newData.code }}
        </el-form-item>
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
            @click.prevent="() => updateVisingForm(formRef)"
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
  class: null,
  code: null,
  description: null,
})

const handleOpenDialog = () => {
  newData.value = {
    code: props.data?.code,
    class: props.data?.class,
    description: props.data?.description,
  }
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const updateVisingForm = (form) => {
  form.validate(async (valid, firlds) => {
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
