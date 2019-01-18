import 'whatwg-fetch';
import querystring from 'query-string';
import { LOGIN_API as authAPI } from '../api/auth';
import { removeToken, getToken } from '../utils/auth';

function authError(response) {
  return !(new RegExp(`${authAPI}$`)).test(response.url) && response.status === 401;
}

export function parseJSON(response) {
  return response.json();
}

export function checkStatus(response) {
  if (!response.ok) {
    // redirect to login when authentication error
    if (authError(response)) {
      removeToken();
      window.location.replace('/');
    }
    // let errorMsg = '';
    // response.json().then(function(data){
    //   console.log(data);
    //   if(data) {
    //     errorMsg = data.message;
    //   }
    // }, function(data){
    //   console.log(data);
    //   if(data) {
    //     errorMsg = data.message;
    //   }
    // });
    const error = new Error(response.statusText);
    // console.log(error);
    error.response = response;
    throw error;
  }
  return response;
}

export function paramToQuery(url, params) {
  if (!Object.keys(params).length) {
    return url;
  }

  return `${url}?${querystring.stringify(params)}`;
}

export function fetchOptions(headers = {}) {
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ApiAuth-Token': getToken(),
      ...headers,
    },
    credentials: 'same-origin',
  };
}

const getHeaderContent = headers => {
  let defaultHeaders = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json',
      'X-ApiAuth-Token': getToken(),
  }
  headers = Object.assign(defaultHeaders, headers);
  // new Headers(headers);
  return headers;
}

export function request(url, options = {
  method: 'GET',
  // for file upload
}){
  let defaultFileOption = {
      file: undefined,
      fileName: undefined,
      chunk: true,
      // chunkSize: 4000000,
      chunkSize: 4000,
      retry: 3,
      md5: true,
      onUploadSuccess: null,
      path: 'resource'
  }
  options = Object.assign(defaultFileOption, options);
  let requestOption = {};
  let method = options.method ? options.method : 'GET';
  let headers = Object.assign(options.headers ? options.headers : {}, {});
  let body = Object.assign(options.body ? options.body : {}, {});
  if (method === 'GET') {
      //发送POST请求 走GET路由
      requestOption.method = 'POST';
      headers['x-http-method-override'] = 'GET';
  } else {
      requestOption.method = method;
  }
  requestOption.headers = getHeaderContent(headers);
  //同域携带cookie
  requestOption.credentials = 'same-origin';

  let requestBody = body;
  requestOption.body = JSON.stringify(requestBody);
  return fetch(url, requestOption);
}
