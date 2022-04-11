import * as types from '../constants/LoginTypes'

export function login() {
  console.log('登录方法');
  return dispatch => {
  dispatch(isLogining()); // 正在执行登录请求
  // 模拟用户登录
  let result = fetch('https://www.baidu.com/').then((res) => {
    dispatch(loginSuccess(true,user)); // 登录请求完成
  }).catch((e)=>{
    dispatch(loginError(false)); // 登录请求出错
  })
  }
}

function loginSuccess(isSuccess, user) {
  console.log('success');
  return {
    type: types.LOGIN_IN_DONE, 
    user: user,
  }
}