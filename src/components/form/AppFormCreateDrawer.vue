<template>
  <div>
    <el-drawer
      v-model="isShow"
      title="巡檢表單建置"
      size="80%"
      @open="handleOpenDrawer"
    >
      <el-form
        ref="formRef"
        :model="newData"
        :disabled="isLoading"
        :rules="rules"
        size="large"
        status-icon
        hide-required-asterisk
      >
        <el-form-item label="巡檢表單名稱" prop="title">
          <el-input v-model="newData.title" placeholder="請輸入巡檢目錄名稱" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-transfer
            ref="newDataTransferRef"
            v-model="newData.itemIds"
            style="text-align: left; display: inline-block"
            filterable
            filter-placeholder="請輸入關鍵字"
            :render-content="handleRenderContent"
            :titles="['檢核細項總清單', '檢核表單項目']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }"
            :data="getTransferList()"
          >
          </el-transfer>
        </el-form-item>
        <el-form-item label="備註" prop="remarks">
          <el-input v-model="newData.remarks" />
        </el-form-item>
        <div class="footer-buttons">
          <el-button
            type="danger"
            text
            size="large"
            class="cancel-button"
            @click.prevent="closeDrawer"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            @click.prevent="() => createForm(formRef)"
            >送出
          </el-button>
        </div>
      </el-form>
    </el-drawer>
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
  getItems: {
    type: Function,
    required: true,
  },
  getTransferList: {
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
  title: null,
  remarks: null,
  itemIds: [],
})

const newDataTransferRef = ref()

const handleOpenDrawer = () => {
  newData.value.itemIds = []
  formRef.value.resetFields()
  formRef.value.clearValidate()
  newDataTransferRef.value.clearQuery('left')
  newDataTransferRef.value.clearQuery('right')
}

const handleRenderContent = (h, option) => {
  return h('span', null, option.label)
}

const closeDrawer = () => {
  emit('update:show', false)
}

const createForm = (form) => {
  if (newData.value.itemIds.length === 0) {
    ElNotification({
      type: 'error',
      message: '新增失敗，請選取檢核細項',
    })
  } else {
    form.validate(async (valid, fields) => {
      if (valid) {
        try {
          const data = {
            title: newData.value.title,
            remarks: newData.value.remarks,
            itemIds: newData.value.itemIds,
          }
          await props.create(data)
          closeDrawer()
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
}
</script>

<style lang="scss" scoped>
.footer-buttons {
  text-align: right;
}

:deep(.el-transfer) {
  width: 75vw;
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-transfer-panel) {
  width: 30vw;
}

:deep(.el-input__wrapper) {
  width: 25vw;
}

:deep(.el-transfer-panel__body) {
  height: 55vh;
  padding: 5px;
}

@media screen and (max-width: 1080px) {
  :deep(.el-transfer-panel) {
    width: 25vw;
  }
  :deep(.el-input__wrapper) {
    width: 20vw;
  }
}
</style>
