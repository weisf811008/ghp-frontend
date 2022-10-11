<template>
  <el-dialog v-model="isShow">
    <img :src="imageUrl" :alt="uploadFile.name" style="width: 100%" />
    <el-link :href="uploadFile.downloadUrl" target="_blank" type="primary">
      檔案下載
    </el-link>
  </el-dialog>
</template>
<script setup>
import { computed } from 'vue'
import textFilesSvgUrl from '../assets/undraw_text_files_au1q.svg?url'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  uploadFile: {
    type: Object,
    default: () => ({}),
  },
})

const emits = defineEmits(['update:show'])

const isShow = computed({
  get: () => props.show,
  set: (val) => emits('update:show', val),
})

const imageUrl = computed(() => props.uploadFile.imageUrl || textFilesSvgUrl)
</script>
