import {Network} from "@/api/Network";

export const SystemNetwork = {
  async captcha({key, success, fail, reject}) {
    return await Network.requestFromParam({
      method: 'get',
      url: '/captcha-code?key=' + key,
      success, fail, reject
    })
  },
  async telCode({tel, success, fail, reject}) {
    return await Network.requestFromParam({
      method: 'get',
      url: '/tel-code?tel=' + tel,
      success, fail, reject
    })
  },
  async codeChek({key, code, success, fail, reject}) {
    return await Network.requestFromParam({
      method: 'post',
      url: '/code/check',
      data: {
        code, key
      },
      success, fail, reject
    })
  },
  async typePage({page, size, data, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'post',
      url: `/type/${page}/${size}`,
      data,
      success, fail, reject
    })
  },
  async typeRemove({id, success, fail, reject}) {
    return await Network.requestFromParam({
      method: 'delete',
      url: `/type/${id}`,
      success, fail, reject
    })
  },
  async typeUpdate({data, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'post',
      url: '/type',
      data,
      success, fail, reject
    })
  },
  async typeSave({data, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'put',
      url: '/type',
      data,
      success, fail, reject
    })
  },

  async empLogin({acc, pass, code, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/emp/login',
      data: {acc, pass, code},
      success, fail, reject
    })
  },
  async readerLogin({acc, pass, code, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/reader/login',
      data: {acc, pass, code},
      success, fail, reject
    })
  },
  async rootLogin({acc, pass, code, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/root/login',
      data: {acc, pass, code},
      success, fail, reject
    })
  },
  async empRegister({data, code, success = null, fail = null, reject = null}) {
    return await Network.requestFromJSON({
      method: "put",
      url: '/register/emp/' + code,
      data: data,
      success, fail, reject
    })
  },
  async readerRegister({data, code, success = null, fail = null, reject = null}) {
    return await Network.requestFromJSON({
      method: "put",
      url: '/register/reader/' + code,
      data: data,
      success, fail, reject
    })
  },
  async verTel({tel, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "get",
      url: '/ver-tel?tel=' + tel,
      success, fail, reject
    })
  },
  async modifyReaderPassword({password, tel, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/reader/password',
      data: {password, tel},
      success,
      fail,
      reject
    })
  },
  async modifyEmpPassword({password, tel, success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/emp/password',
      data: {password, tel},
      success, fail, reject
    })
  },
  async unLogin({success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method: "post",
      url: '/unLogin',
      success, fail, reject
    })
  },
}
export const LOGIN_CODE_ROOT = "root-login-code";
export const LOGIN_CODE_READER = "reader-login-code";
export const LOGIN_CODE_EMP = "emp-login-code";
