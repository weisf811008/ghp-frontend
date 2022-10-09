<template>
  <div>
    <el-dialog
      v-model="isShow"
      title="選擇巡檢表單"
      width="100%"
      @open="handleOpenDialog"
      style="max-width: 550px"
    >
      <el-form
        ref="formRef"
        :model="inspectFormData"
        :disabled="isLoading"
        :rules="rules"
        size="large"
        status-icon
        hide-required-asterisk
      >
        <el-form-item label="選擇表單" prop="formId">
          <el-select
            class="formSelect"
            size="large"
            v-model="inspectFormData.formId"
            placeholder="選擇表單"
          >
            <el-option
              v-for="form in forms"
              :value="form.id"
              :label="form.title"
              :key="`select-form-${form.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="mb-footer-button">
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
            class="submit-button"
            @click.prevent="() => handleOpenInspectForm(formRef)"
            >送出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  forms: {
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
})

const router = useRouter()
const emit = defineEmits(['update:show'])

const isShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const formRef = ref()
const inspectFormData = ref({
  formId: null,
})

const handleOpenDialog = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
}

const closeDialog = () => {
  emit('update:show', false)
}

const handleOpenInspectForm = (form) => {
  form.validate(async (valid, fields) => {
    if (valid) {
      router.push({
        name: 'InspectionSubmitting',
        params: {
          formId: inspectFormData.value.formId,
        },
      })
    }
  })
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
  .mb-footer-button {
    display: flex;
    width: 100%;

    .cancel-button {
      background-color: #f0f2f5;
    }
    .cancel-button {
      width: 50%;
    }
    .submit-button {
      width: 50%;
    }
  }
}
</style>
