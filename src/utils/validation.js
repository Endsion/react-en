import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import { defaultPath } from '../constants/defaultPath';
import { adminPath } from '../constants/adminPath';
import { isAdmin } from '../utils/auth';
import includes from 'lodash/includes';
import { OP_KEY_ACTION_HASH } from '../constants/roleValidation';
import { notification } from 'antd';
import message from './message';

function getKeysFromMenu(menu) {
  let keys = [menu.key];
  if (Array.isArray(menu.items)) {
    keys = keys.concat(menu.items.map(menuItem => menuItem.key));
    if (menu.subs) {
      const subKeys = menu.subs.map(subMenu => getKeysFromMenu(subMenu));
      keys = keys.concat(flattenDeep(subKeys));
    }
  }
  return compact(keys);
}

function matchRole(role, menu) {
  if (role.includes(menu.key)) {
    return true;
  } else {
    const roleKeys = getKeysFromMenu(menu);
    const hasSubMenusEnabled = uniq(roleKeys.concat(role)).length < (roleKeys.length + role.length);
    if (hasSubMenusEnabled) {
      return true;
    } else {
      return false;
    }
  }
}

// check if the menu display or not
export function checkMenuRoles(userRoles, menu) {
  const key = menu.key;
  if (defaultPath.includes(key) ||
    (isAdmin() && adminPath.includes(key))) {
      return true;
  } else if (!isAdmin() && adminPath.includes(key)) {
    return false;
  }
  return !userRoles.map(role => role.displayPermission.split(',')).every(role => !matchRole(role, menu));
}

export function checkURL(userRoles, pathname) {
  const urlKey = pathname.split('/')[2] || 'dashboard'; // deal with root path('/app')
  let hasRole = false;
  if (defaultPath.includes(urlKey) ||
    (isAdmin() && adminPath.includes(urlKey))) {
    hasRole = true;
  } else if (!isAdmin() && adminPath.includes(urlKey)) {
    hasRole = false;
  } else {
    hasRole = !userRoles.map(role => role.displayPermission.split(',')).every(role => !role.includes(urlKey));
  }
  return hasRole;
}

function matchUserRole(key, userRole) {
  let hasPermission = false;
  if(userRole.data){
    userRole = userRole.data;
  }
  if (userRole) {
    userRole.map(role => {
      //if (role.operationPermissions.split(',').includes(key)) {
      if(role.operationPermissions){
        role.operationPermissions.map(op => {
          if(op.name.toLowerCase() == key){
            hasPermission = true;
          }
        });
      }
    });
  }
  return hasPermission;
}

export function checkPermission(actionCreator, dispatch, params, userRole) {
  return dispatch(actionCreator(params));
  if(!OP_KEY_ACTION_HASH[actionCreator.name] || OP_KEY_ACTION_HASH[actionCreator.name] && matchUserRole(OP_KEY_ACTION_HASH[actionCreator.name], userRole)) {
    return dispatch(actionCreator(params));
  } else {
    const noPermission = new Promise(function(resolve, reject){
      reject(message('NO_PERMISSION'));
    }).catch( e => {
      notification.error({
        message: e,
        description: e,
      });
    });
    return noPermission;
  }
}
