<template>
  <el-popover placement="bottom" :width="230" trigger="click">
    <template #reference>
      <el-button type="success">还书</el-button>
    </template>
    <el-date-picker
        v-model="timeRef"
        type="datetime"
        placeholder="还书时间（默认当前）"
        :default-time="defaultTime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :disabled-date="disabledDate"
    />
    <div>
      <el-button
          type="danger"
          @click="returnBookSubmit"

      >确定还书
      </el-button>
    </div>
  </el-popover>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue";

let proxy = getCurrentInstance().proxy;
const props = defineProps({
  time: {
    type: String
  },
  returnBookSubmit: {
    type: Function
  }
})

const timeRef = ref(props.time)


watch(() => props.time, () => {
  timeRef.value = proxy.time;
})
watch(timeRef, () => {
  proxy.$emit('update:time', timeRef.value)
})

const defaultTime = new Date();
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
</script>

<style scoped>

</style>
