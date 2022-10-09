<template>
  <div>
    <el-drawer v-model="isShow" title="查看巡檢紀錄" size="100%">
      <el-descriptions border :column="1">
        <el-descriptions-item label="表單名稱">
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
      <el-card
        v-for="(row, index) in inspection.details"
        :key="`insp-mb-${row.id}`"
        class="mb-card"
      >
        <el-descriptions :column="1">
          <el-descriptions-item label="#">
            {{ index + (page - 1) * pageSize + 1 }}
          </el-descriptions-item>
          <el-descriptions-item label="檢核大項">
            {{ row.category }}
          </el-descriptions-item>
          <el-descriptions-item label="檢核細項">
            {{ row.item }}
          </el-descriptions-item>
          <el-descriptions-item label="測量值">
            {{ row.checkValue }}
          </el-descriptions-item>
          <el-descriptions-item label="檢核結果">
            <span
              :class="{
                pass: row.status === 'pass',
                fail: row.status === 'fail',
                others: row.status === 'others',
              }"
            >
              {{ statusMap[row.status] }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item>
            <div>
              <el-card>
                {{ row.remarks }}
              </el-card>
            </div>
            <div>
              <el-upload
                :file-list="
                  row.files.map((f) => ({
                    name: f.originalname,
                    url: `/api/inspections/files/${f.filename}`,
                  }))
                "
                :on-preview="handlePictureCardPreview"
                list-type="picture-card"
                disabled
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
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
