<template>
  <el-upload
    :file-list="fileList"
    :disabled="!uploadable"
    list-type="picture-card"
    action="/api/inspections/files"
    @preview="handlePreview"
    @success="handleSuccess"
    @remove="handleRemove"
  >
    <el-icon v-show="uploadable">
      <Plus />
    </el-icon>
  </el-upload>
</template>
<script setup>
import { computed } from 'vue'
import textFilesSvgUrl from '../assets/undraw_text_files_au1q.svg?url'

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  uploadable: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Function,
  },
  success: {
    type: Function,
  },
  remove: {
    type: Function,
  },
})

// uploadFIle = {
//   id: 1,
//   filename: '上傳檔案名稱',
//   originalname: '原檔案名稱',
// }

const emits = defineEmits(['preview', 'success', 'remove'])

const imgExt = ['png', 'jpg', 'jpeg']

const isImage = (originalname) =>
  imgExt.includes(originalname.split('.').pop().toLowerCase())

const getDownloadUrl = (filename) => `/api/inspections/files/${filename}`

const fileList = computed(() =>
  props.data.map(({ filename, originalname }) => {
    const downloadUrl = getDownloadUrl(filename)
    return {
      name: originalname,
      url:
        filename && originalname && isImage(originalname)
          ? downloadUrl
          : textFilesSvgUrl,
      downloadUrl,
    }
  })
)

const handlePreview = ({ name, url, downloadUrl }) => {
  emits('preview', {
    name,
    imageUrl: url,
    downloadUrl: downloadUrl,
  })
}

const handleSuccess = (result) => {
  emits('success', result)
}

const handleRemove = (file, files) => {
  emits('remove', file, files)
}
</script>
