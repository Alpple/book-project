<template>
  <el-select
      v-model="select"
      filterable
      remote
      reserve-keyword
      placeholder="Please enter a keyword"
      :remote-method="remoteMethod"
      :loading="loading"
      clearable
  >
    <el-option
        v-for="item in records"
        :key="item.id"
        :label="item.name"
        :value="item.id"
    />
  </el-select>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";
import {BookNetwork} from "@/api/Book";

let proxy = getCurrentInstance().proxy;
const props = defineProps({
  modelValue: ( Number|String)
})
const select = ref(props.modelValue)
watch(select, () => {
  proxy.$emit('update:modelValue', select.value)
})
const loading = ref(false)
const records = ref([])

watch(() => props.modelValue, () => {
  loadData(undefined, props.modelValue)
}, {immediate: true})
const remoteMethod = (query) => {
  loading.value = true
  if (query.length === 0) {
    query = undefined;
  }
  loadData(query)
}

function loadData(value, id = undefined) {
  records.value = []
  BookNetwork.typeList({
    page: 1,
    size: 99999,
    type: {
      name: value,
      id: id,
    },
    success: (res) => {
      records.value = res.result.records
      loading.value = false
    },
    reject: () => {
      loading.value = false
    },
    fail: () => {
      loading.value = false
    }
  })
}
</script>

<style scoped>

</style>
