<template>
  <div class="warp">
    <div class="title">
      <h3>{{$route.params.message}}</h3>
    </div>
    <div>
      <div ref="dotBox" style="width: 600px;height: 300px;position: relative"></div>
    </div>
    <div>
      <el-button type="primary" @click="back">返回上一级</el-button>
    </div>
  </div>
</template>
<script setup >

import {getCurrentInstance, onMounted} from "vue";
import DocumentDot from "@/lib/document-dot/DocumentDot";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const route = useRoute();
const proxy = getCurrentInstance()?.proxy;

const back=()=>{
  router.replace(
      route.params.from ? route.params.from :'/login'
  )
}


onMounted(() => {
  let message = route.params.message ? route.params.message:'错误';
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
        documentDot.emitDot(message)
      }
    }
  }, message);
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
