<template>
  <el-radio-group v-model="type" class="ml-4">
    {{type}}
    <el-radio :label="LOGIN_CODE_READER">读者</el-radio>
    <el-radio :label="LOGIN_CODE_EMP">图书管理员</el-radio>
    <el-radio :label="LOGIN_CODE_ROOT" v-if="showRoot">系统管理员</el-radio>
  </el-radio-group>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";
import {LOGIN_CODE_EMP, LOGIN_CODE_READER, LOGIN_CODE_ROOT, SystemNetwork} from "@/api/System";

const props = defineProps({
  modelValue: String,
  showRoot: Boolean
})
let proxy = getCurrentInstance().proxy;
const type = ref(props.modelValue || localStorage.getItem('user-type'))
watch(type, () => {
  if (!props.showRoot&&type.value===LOGIN_CODE_ROOT){
    type.value = LOGIN_CODE_READER;
  }
  localStorage.setItem('user-type', type.value)
  proxy.$emit('update:modelValue', type.value)
}, {immediate: true})

</script>

<style scoped>

</style>
