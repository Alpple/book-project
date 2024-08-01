import {Network} from "@/api/Network";

export const CaptchaCodeNetwork = {
  async getCode({success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method:"post",
      type: 'postParam',
      url: '/captcha-code',
      data: {},
      success,
      fail,
      reject
    })
  },
  async check({code,success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method:"post",
      type: 'postParam',
      url: '/captcha-code-check',
      data: {code:code},
      success,
      fail,
      reject
    })
  },
  async getTelCode({tel,success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method:"post",
      type: 'postParam',
      url: '/tel-code',
      data: {tel:tel},
      success,
      fail,
      reject
    })
  },
  async checkTelCode({code,success = null, fail = null, reject = null}) {
    return await Network.requestFromParam({
      method:"post",
      type: 'postParam',
      url: '/tel-code-check',
      data: {code:code},
      success,
      fail,
      reject
    })
  }
}