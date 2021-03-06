import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN } from '../../globalset/js/constant'

//d登录
export async function formSubmit(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/signin`,
    method: 'POST',
    data,
  });
}

//获取验证码
export async function requestVerifyCode(data) {
  return request({
    url: `${REQUEST_DOMAIN}/sms/code/send`,
    method: 'POST',
    data,
  });
}

//绑定微信号与账号
export async function wechatAccountBind(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/wechat/account/bind`,
    method: 'POST',
    data
  })
}
