import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.token = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.data === undefined || response.data === null || response.data === '') {
      Message({
        message: '无数据返回',
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    const res = response.data
    // if the custom successful is not true, it is judged as an error.
    if (res.successful === false) {
      Message({
        message: res.message || '数据返回失败',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.status === 400) {
      Message({
        message: '错误码：400（未知错误）',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 401) {
      // to re-login
      MessageBox.confirm('身份验证失败，请重新登录', '温馨提示', {
        confirmButtonText: '重新登录',
        type: 'error',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    if (error.response.status === 403) {
      // to re-login
      MessageBox.confirm('身份验证失败，请重新登录', '温馨提示', {
        confirmButtonText: '重新登录',
        type: 'error',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    if (error.response.status === 404) {
      Message({
        message: '错误码：404（未找到相关内容）',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (error.response.status === 500) {
      Message({
        message: '错误码：500（服务器错误）',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
