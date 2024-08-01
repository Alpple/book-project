<template>
  <el-select
      v-model="select"
      filterable
      remote
      reserve-keyword
      placeholder="手机号"
      :remote-method="remoteMethod"
      :loading="loading"
      clearable
  >
    <el-option
        v-for="item in records"
        :key="item.id"
        :label="item.name+'-'+item.tel"
        :value="item.id"
    />
  </el-select>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";
import {BookNetwork} from "@/api/Book";
import {UserNetwork} from "@/api/User";

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
  if (!props.modelValue) {
    select.value = undefined;
    records.value = []
    return;
  }
  loadData(undefined,props.modelValue)
})
const remoteMethod = (query) => {
  records.value = []
  if (query) {
    loading.value = true
    loadData(query)
  } else {
    records.value = []
  }
}
function loadData(value, id = undefined)  {
  UserNetwork.listReader({
    page: 1,
    size: 99999,
    reader: {
      tel: value,
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
if (props.modelValue) {
  loadData(undefined, props.modelValue)
}
</script>

<style scoped>

</style>
