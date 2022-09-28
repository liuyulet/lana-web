import { axios, weixinaxios } from '@/utils/request'
import signMd5Utils from '@/utils/encryption/signMd5Utils'

//post
export function postAction(url, parameter) {
  let sign = signMd5Utils.getSign(url, parameter);
  //将签名和时间戳，添加在请求接口 Header
  let signHeader = { "X-Sign": sign, "X-TIMESTAMP": signMd5Utils.getDateTimeToString(), };
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    headers: signHeader
  })
}

//post method= {post | put}
export function httpAction(url, parameter, method) {
  let sign = signMd5Utils.getSign(url, parameter);
  //将签名和时间戳，添加在请求接口 Header
  let signHeader = { "X-Sign": sign, "X-TIMESTAMP": signMd5Utils.getDateTimeToString() };

  return axios({
    url: url,
    method: method,
    data: parameter,
    headers: signHeader
  })
}

//put
export function putAction(url, parameter) {
  return axios({
    url: url,
    method: 'put',
    data: parameter
  })
}

//get
export function getAction(url, parameter) {
  let sign = signMd5Utils.getSign(url, parameter);
  //将签名和时间戳，添加在请求接口 Header
  let signHeader = { "X-Sign": sign, "X-TIMESTAMP": signMd5Utils.getDateTimeToString() };

  return axios({
    url: url,
    method: 'get',
    params: parameter,
    headers: signHeader
  })
}
//deleteAction
export function deleteAction(url, parameter) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter
  })
}
