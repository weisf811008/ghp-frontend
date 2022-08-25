import {ref} from 'vue'
import {defineStore} from 'pinia'
import { request } from '../utils/http.util'

const resource = 'schools'

export const useSchoolStore = defineStore(resource, () => {
    const schools = ref([])
    const isLoading = ref(false)

    const getSchools = async () => {
        isLoading.value = true
        const res = await request.get(resource)
        schools.value = res.data.schools
        isLoading.value = false
    }

    const createSchool = async (data) => {
        isLoading.value = true
        await request.post(resource, data)
        isLoading.value = false
        await getSchools()
    }

    const updateSchool = async(id, data) => {
        isLoading.value = true
        await request.put(`${resource}/${id}`, data)
        isLoading.value = false
        await getSchools()
    }

    const deleteSchool = async (id) => {
        isLoading.value = true
        await request.delete(`${resource}/${id}`)
        isLoading.value = false
        await getSchools()
    }


    return {
        schools,
        isLoading,
        getSchools,
        createSchool,
        updateSchool,
        deleteSchool
    }
})