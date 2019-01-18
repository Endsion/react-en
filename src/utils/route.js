import { loggedIn } from './auth';
import { RESOURCES_MAP } from '../constants/resources';
import { Modal } from 'antd';

export function redirectToApp(state, replace) {
  if (loggedIn()) {
    let path = '/app';

    if (state && state.nextPathname && /\/app/.test(state.nextPathname)) {
      path = state.nextPathname;
    }

    replace(path);
  }
}

export function redirectToLogin(state, replace) {
  if (!loggedIn()) {
    let nextPathname;
    if (state && state.location) {
      nextPathname = state.location.pathname;
    }

    replace({
      pathname: '/',
      state: { nextPathname },
    });

    Modal.info({
      title: '会话过期',
      content: '您的会话过期了，请重新登录。',
      className: 'cloud-ant',
    });
  }
}

export function getResourceDetailURL(type, id) {
  if (RESOURCES_MAP[type]) {
    return '/app/' + RESOURCES_MAP[type] + '/' + id;
  }
}
