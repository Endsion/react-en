import isNil from 'lodash/isNil';

const jwtDecode = require('jwt-decode');

export function getToken() {
  return '12345678';
  //return localStorage.getItem('token');
}

export function setToken(token) {
  //localStorage.setItem('token', token);
  localStorage.setItem('token', '12345678');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function decode(encodedToken) {
  try {
    const token = JSON.parse(jwtDecode(encodedToken).sub).token;
    if (token) return token;
    return {};
  } catch (e) {
    return {};
  }
}

export function loggedIn() {
  const token = getToken();
  if (isNil(token)) {
    return false;
  }
  // return true;
  return Date.now() < new Date(decode(token).exp);
}

export function isAdmin() {
  const token = getToken();
  return (decode(token).isAdmin === 'true');
}

export function getRegion() {
  const token = getToken();
  return (decode(token).currentRegion);
}

export function getTenant() {
  const token = getToken();
  return (decode(token).projectName);
}

export function getLocale() {
  const token = getToken();
  return (decode(token).locale || 'zh');
}

export function getAccount() {
  const token = getToken();
  return (decode(token).userAccount || '');
}

export function enableZabbix() {
  const token = getToken();
  return (decode(token).enableZabbix === 'true');
}

export function enableWorkflow() {
  const token = getToken();

  return (decode(token).enableWorkflow === 'true');
}
