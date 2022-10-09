<template>
  <div>
    <el-drawer v-model="isShow" title="查看巡檢紀錄" size="80%">
      <el-descriptions border :column="2">
        <el-descriptions-item label="表單名稱" :span="2">
          {{ inspection.title }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢日期">
          {{
            inspection.date && format(parseISO(inspection.date), 'yyyy/MM/dd')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="限期改善日期">
          {{
            inspection.dueDate &&
            format(parseISO(inspection.dueDate), 'yyyy/MM/dd')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢人員">
          {{ inspection.inspectedBy?.name }}
        </el-descriptions-item>
        <el-descriptions-item label="填報時間">
          {{
            inspection.createdAt &&
            format(parseISO(inspection.createdAt), 'yyyy/MM/dd HH:mm')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="備註">
          {{ inspection.remarks }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        :data="inspection.details"
        style="width: 100%"
        :default-expand-all="true"
      >
        <el-table-column label="項次" fixed align="center" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="檢核大項" prop="category" width="170" />
        <el-table-column label="檢核細項" prop="item" />
        <el-table-column
          label="測量值"
          prop="checkValue"
          align="center"
          width="90"
        />
        <el-table-column
          label="檢核結果"
          prop="status"
          align="center"
          width="230"
        >
          <template #default="scope">
            <span
              :class="{
                pass: scope.row.status === 'pass',
                fail: scope.row.status === 'fail',
                others: scope.row.status === 'others',
              }"
            >
              {{ statusMap[scope.row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template #default="scope">
            <div>
              <el-card>
                {{ scope.row.remarks }}
              </el-card>
            </div>
            <div>
              <el-upload
                :file-list="
                  scope.row.files.map((f) => ({
                    name: f.originalname,
                    url: `/api/inspections/files/${f.filename}`,
                  }))
                "
                :on-preview="handlePictureCardPreview"
                list-type="picture-card"
                disabled
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <el-dialog v-model="dialogImageVisible">
      <img
        v-if="isImage"
        :src="dialogImageUrl"
        alt="Preview Image"
        style="width: 100%"
      />
      <img
        v-else
        src="../assets/undraw_text_files_au1q.svg"
        alt="Preview Image"
        style="width: 100%"
      />
      <el-link :href="dialogImageUrl" target="_blank" type="primary">
        檔案下載
      </el-link>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, parseISO } from 'date-fns'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  inspection: {
    type: Object,
    default: () => ({}),
  },
  page: {
    type: Number,
  },
  pageSize: {
    type: Number,
  },
})

const emit = defineEmits(['update:show'])

const isShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const statusMap = {
  pass: '合格',
  fail: '不合格',
  others: '其他',
}

const dialogImageUrl = ref('')
const dialogImageVisible = ref(false)

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogImageVisible.value = true
}

const imgExt = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

const isImage = computed(() =>
  imgExt.includes(dialogImageUrl.value.split('.').pop().toLowerCase())
)
</script>

<style lang="scss" scoped>
:deep(div.el-upload.el-upload--picture-card) {
  display: none;
}
</style>
