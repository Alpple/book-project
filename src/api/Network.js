import axios from "axios";

/**
 * SpringMVC 请求 @requestParam注解传参数
 * @param method
 * @param url 请求URL
 * @param data 请求参数
 * @param config  请求配置
 * @param success 响应成功，结果成功
 * @param fail  响应成功，结果失败
 * @param reject  响应失败
 * @return  Promise<AxiosResponse<any>>
 */
async function formParam({method,url, data = {}, config = {}, success, fail, reject}) {
  const formData = new FormData()
  for (let k in data) {
    formData.append(k, data[k])
  }
  let headers = config.headers || {'Content-Type':  'multipart/form-data'}
  delete config['headers']
  return await axios.request({
    method, url, data:formData,
    headers,
    ...config
  })
    .then((res) => {
      if (res.data.code === 200) {
        if (success instanceof Function) {
          success(res.data, res);
        }
      } else {
        if (fail instanceof Function) {
          fail(res.data, res);
        }
      }
    })
    .catch(r => {
      console.error(r)
      if (reject instanceof Function) {
        reject(r);
      }
    })
}


/**
 *SpringMVC 请求 @requestBody注解传参数
 * @param method
 * @param url 请求URL
 * @param data 请求参数
 * @param config  请求配置
 * @param success 响应成功，结果成功
 * @param fail  响应成功，结果失败
 * @param reject  响应失败
 * @return  Promise<AxiosResponse<any>>
 */
async function formJSON({method, url, data = {}, config = {}, success, fail, reject}) {
  let headers = config.headers || {'Content-Type': 'application/json'}
  delete config['headers']
  return await axios.request({
    method, url, data,
    headers,
    ...config
  })
    .then((res) => {
      if (res.data.code === 200) {
        if (success instanceof Function) {
          success(res.data, res);
        }
      } else {
        if (fail instanceof Function) {
          fail(res.data, res);
        }
      }
    })
    .catch(r => {
      console.error(r)
      if (reject instanceof Function) {
        reject(r);
      }
    })
}


// step3：使每次请求都会带一个 /api 前缀
if (process.env.NODE_ENV !== 'production') {
  axios.defaults.baseURL = '/api'
} else {
  axios.defaults.baseURL = ''
}

/**
 *
 * @param requestOnFulfilled
 * @param requestOnRejected
 * @param responseOnFulfilled
 * @param responseOnRejected
 */
function interceptors_({
                         requestOnFulfilled = function (config) {
                           return config
                         },
                         requestOnRejected = function (error) {
                           return Promise.reject(error)
                         },
                         responseOnFulfilled = function (response) {
                           return response
                         },
                         responseOnRejected = function (error) {
                           return Promise.reject(error)
                         }
                       }) {
// 添加请求拦截器
  axios.interceptors.request.use(requestOnFulfilled, requestOnRejected);
// 添加响应拦截器
  axios.interceptors.response.use(responseOnFulfilled, responseOnRejected);
}

export const Network = {
  requestFromJSON: formJSON,
  requestFromParam: formParam,
}
export const interceptors = interceptors_

