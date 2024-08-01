<template>
  <div class="warp">
    <div class="title">
      <h3>404 页面不存在!</h3>
    </div>
    <div>
      <div ref="dotBox" style="width: 600px;height: 300px;position: relative"></div>
    </div>
    <div>
      <el-button type="primary" @click="$router.go(-1)">返回上一级</el-button>
    </div>
  </div>
</template>

<script setup >

import {getCurrentInstance, onMounted} from "vue";
import DocumentDot from "@/lib/document-dot/DocumentDot";

let proxy = getCurrentInstance()?.proxy;
onMounted(() => {

  let documentDot = new DocumentDot({
    canvasCount: 1, height: 300, width: 600,
    box: proxy.$refs['dotBox'],
    dotConfig: {
      r: 2,
      color: {
        fill: 'rgba(255,0,0,0.33)',
        stroke: '#fff'
      },
      cache: false,
      ctxMode: 0,
      initDotMode: 2
    },
    callback: {
      callbackType: 'forever',
      callback: () => {
        documentDot.emitDot("404")
      }
    }
  }, "404");
  documentDot.animation();
})
</script>

<style scoped>
.warp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
</style>
