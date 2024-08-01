import {Network} from "@/api/Network";

/**
 * 登录
 * @param acc
 * @param password
 * @param success 请求成功、处理成功
 * @param fail    请求成功、处理失败
 * @param reject  请求失败
 * @return Promise<AxiosResponse<*>>
 */
export const UserNetwork = {
  async listReader({page, size, reader = undefined, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'POST',
      url: `/user/reader/list/${page}/${size}`,
      config: {
        data: {
          ...(reader || {})
        }
      },
      success, fail, reject
    })
  },
  async listEmp({page, size, emp = undefined, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'POST',
      url: `/user/emp/list/${page}/${size}`,
      config: {
        data: {
          ...(emp || {})
        }
      },
      success, fail, reject
    })
  },
  async resetReaderPassword({id, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/user/reader/reset/password',
      data: {id},
      success, fail, reject
    })
  },
  async resetEmpPassword({id, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/user/emp/reset/password',
      data: {id},
      success, fail, reject
    })
  },
  async empRegister({data, success = null, fail = null, reject = null}) {
    return await Network.requestFromJSON({
      method: "put",
      url: '/user/emp',
      data: data,
      success, fail, reject
    })
  },
  async empEnabled({id, enabled, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/user/emp/enabled',
      data: {id, enabled},
      success, fail, reject
    })
  },
  async readerRemove({id, success = null, fail = null, reject = null}) {
    return await Network.requestFromJSON({
      method: "delete",
      url: '/user/reader/' + id,
      success, fail, reject
    })
  },
  async readerUpdate({data, success = null, fail = null, reject = null}) {
    return await Network.requestFromJSON({
      method: "post",
      url: '/user/reader',
      config: {data},
      success, fail, reject
    })
  },
  async empUpdate({data, success = null, fail = null, reject = null}) {
    return await Network.requestFromJSON({
      method: "post",
      url: '/user/emp',
      config: {data},
      success, fail, reject
    })
  },

}
UserNetwork.readerRules = {
  name: [
    {required: true, message: '姓名不能为空', trigger: 'blur'},
    {min: 2, max: 10, message: "长度为2-10", trigger: 'blur'}
  ],
  sex: [
    {required: true, message: '性别不能为空', trigger: 'blur'},
  ],
  tel: [
    {required: true, message: '电话不能为空', trigger: 'blur'},
    {min: 11, max: 11, message: "长度为11", trigger: 'blur'}
  ],
  account: [
    {required: true, message: '账号不能为空', trigger: 'blur'},
    {min: 8, max: 8, message: "长度为8", trigger: 'blur'}
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {min: 8, max: 16, message: "长度为8-16", trigger: 'blur'}
  ]
}

