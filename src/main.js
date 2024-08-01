import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// #begin:element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
// #end:element-plus

// #begin:axios封装
import {interceptors, Network} from "@/api/Network";
import axios from "axios";
// #end:axios封装
// import axios from 'axios'
// import VueAxios from 'vue-axios'

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)

// .use(VueAxios,axios) // 不注册到组件上,二次封装axios网络请求接口

// Element Plus图表注册
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key])
})

// 引用ElementUI挂载的全局方法
const $notify = app.config.globalProperties.$notify;
// 路由
const $router = app.config.globalProperties.$router;

// 挂载全局方法
app.config.globalProperties.$network = Network

interceptors({
  requestOnFulfilled(config) {
    let json = {};
    if (config.data instanceof FormData) {
      let keys = config.data.keys();
      let next = keys.next()
      while (!next.done) {
        json[next.value] = config.data.get(next.value)
        next = keys.next()
      }
    } else {
      json = config.data
    }
    console.debug('request :', 'url:', config.url, 'data:', json, 'params:', config.params)
    return config;
  },
  // 拦截服务器 返回的每一个 成功的响应
  responseOnFulfilled(response) {
    console.debug('response success data:', response.data)
    // 请求响应成功，单业务处理上不一定正确
    switch (response.data.code) {
      // 自定义的 一个结果状态码
      case 200:
        break;
      default:
        $notify({
          title: '错误码：' + response.data.code,
          message: response.data.msg,
          type: 'error',
          duration: 2000
        });
        break;
    }
    // 对响应数据做点什么
    return response;
  },
  // 拦截服务器 返回的每一个 错误的响应
  responseOnRejected(error) {
    const err = JSON.parse(JSON.stringify(error));
    console.debug('response error :', err, error)
    // 服务端定义的 未登录 错误 的 状态码 为 401
    if (err.status === 401) {
      $notify.error("你还没登录")
      $router.push({name: 'Login'})
      return Promise.reject("error");
    }
    $notify({
      title: '错误(reject)',
      message: error,
      type: 'error',
      duration: 2000
    });
    return Promise.reject(error);
  }

})

router.beforeEach((to, from, next) => {
  // console.log("from", from.name, from.meta, 'to', to.name, to.meta)
  let toMeta = to.meta;
  // 不需要身份验证
  if (!toMeta.auth) {
    next();
    return;
  }

  //需要身份验证
  // console.log(store.state.user)
  let user = store.state.user;
  /*  if (
      (typeof toMeta.only !== 'undefined' && toMeta!==user.factor)
      ||
      (typeof toMeta.only === 'undefined'&&user.factor < toMeta.factor)
    )
    {
      // 权限不够
      next({
        name:"Error",
        params:{
          message:"权限错误",
          from: from.fullPath
        }
      })
    }
    next();*/
  if (typeof toMeta.only === 'undefined') {
    if (user.factor >= toMeta.factor) {
      // 权限够
      next();
    }

  } else {
    if (user.factor === toMeta.only) {
      // 权限够
      next();
    }
  }
  // 权限不够
  next({
    name: "Error",
    params: {
      message: "权限错误",
      from: from.fullPath
    }
  })
})


app.mount('#app')



