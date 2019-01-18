import { STATUS_STR, STATUS_STR_IMAGE, STATUS_STR_WORKFLOW, OPERATION_STR } from '../constants/statusSettings';
import { TYPE_SET, ZONE_TYPE } from '../constants/typeSettings';
import { getLocale, isAdmin, enableWorkflow } from '../utils/auth';
import { zh_CN } from '../locale/zh_CN';
import { en_US } from '../locale/en_US';
import React from 'react';
import { Progress, Col, Spin, Icon } from 'antd';

export function dict(key, array, keyColumn, valColumn) {
  let returnVal = key;
  if (array && array.length > 0) {
    for (const obj of array) {
      if (obj[keyColumn] === key) {
        returnVal = obj[valColumn];
        break;
      }
    }
  }

  return returnVal;
}

export function formatByteSizeToGBWithNoUnit(byteSize) {
  return parseInt(byteSize / 1024 / 1024 / 1024);
}

export function formatByteSizeToGB(byteSize) {
  return (byteSize / 1024 / 1024 / 1024).toFixed(2);
}

export function formatMBSizeToGB(byteSize) {
  return (byteSize / 1024).toFixed(2);
}

/* export function checkPassword(formatMessage) {
  return (
    function passwordCheck(rule, value, callback) {
      if (!/^([\u4e00-\u9fa5]+|[a-zA-Z0-9]+)$/.test(value)) {
        callback(new Error(formatMessage({ id: 'Utils_Data_Check_Password' })));
      } else {
        callback();
      }
    }
  );
}*/

export function checkPassword(formatMessage) {
  return (
    function passwordCheck(rule, value, callback) {
      if (!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,20}$/.test(value)) {
        callback(new Error(formatMessage({ id: 'Password_check_need_AZaz09' })));
      } else {
        callback();
      }
    }
  );
}

export function checkIPFormat(formatMessage,id = 'Utils_Data_Check_IP') {
  return (
    function ipFormatCheck(rule, value, callback) {
      if (value && !/^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/.test(value)) {
        callback(new Error(formatMessage({ id: id })));
      } else {
        callback();
      }
    }
  );
}

export function checkCIDRFormat(formatMessage) {
  return (
    function cidrFormatCheck(rule, value, callback) {
      if (value && !/^(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$/.test(value)) {
        callback(new Error(formatMessage({ id: 'Utils_Data_Check_CIDR' })));
      } else {
        callback();
      }
    }
  );
}

export function nameFormat(value,canChinese = true) {
  const exp = canChinese ? /^[\u4e00-\u9fa5a-zA-Z0-9_\-]*$/i : /^[a-zA-Z0-9_\-]*$/i;
  if (exp.test(value)) {
    return true;
  } else {
    return false;
  }
}

export function nameSpace(value) {
  if (value && /\s/g.test(value)) {
    return true;
  } else {
    return false;
  }
}

export function checkNameFormat(formatMessage,canChinese = true) {
  const errorTips = canChinese ? formatMessage({ id: 'Utils_Data_Check_Name' }) +
    formatMessage({ id: 'Utils_Data_Name_Format_Chinese_Tips' }) :formatMessage({ id: 'Utils_Data_Check_Name' }) +
    formatMessage({ id: 'Utils_Data_Name_Format_Tips' }) ;
  return (
    function nameFormatCheck(rule, value, callback) {
      if (!nameFormat(value,canChinese)) {
        callback(new Error(errorTips));
      } else {
        callback();
      }
    }
  );
}

export function checkDuplicate(array, name) {
  let ret = false;
  for (const data of array) {
    if (data.name === name) {
      ret = true;
    }
  }
  return ret;
}

export function checkTerminal(array, name) {
  let ret = false;
  for (const data of array) {
    if (data.content === name) {
      ret = true;
    }
  }
  return ret;
}

function findTaskState(obj){
  if('taskState' in obj){
    return obj['taskState']
  }
  for(let key in obj){
    if(typeof obj[key] == "object" && obj[key].constructor == Object){
      const df = findTaskState(obj[key]);
      if(df){
        return df;
      }
    }
  }
  return '';
}
export function renderStatus(text, type) {
  let reData = '';
  let taskState = '';
  if(typeof type == "object" && type.constructor == Object){
    taskState = findTaskState(type)
  }
  const locale = getLocale();
  const status = (text || '').toUpperCase();
  let labelKey = '';
  if (type === 'image') {
    labelKey = STATUS_STR_IMAGE[status] || STATUS_STR[status] || status;
  } else if(type === 'workflow') {
    labelKey = STATUS_STR_WORKFLOW[status] || STATUS_STR[status] || status;
  } else {
    labelKey = STATUS_STR[status] || status;
  }
  if (locale === 'en') {
    reData = en_US[labelKey] || labelKey;
  } else {
    reData = zh_CN[labelKey] || labelKey;
  }
  if(taskState != '' && taskState != 'NONE'){
    const style = {'margin-left':'10px','color':'#1890ff','font-size':'14px'};
    return <span>{reData} <Icon type="reload" spin style={style} /> </span>;
  }
  return reData;
}

export function renderSort(text) {
  let content = 'desc';
  if (!text) {
    content = 'desc';
  } else if (text === 'ascend') {
    content = 'asc';
  } else if (text === 'descend') {
    content = 'desc';
  }

  return content;
}

export function renderOperationStatus(text) {
  const locale = getLocale();
  const status = (text || '').toUpperCase();
  const labelKey = OPERATION_STR[status] || status;
  if (locale === 'en') {
    return en_US[labelKey] || labelKey;
  } else {
    return zh_CN[labelKey] || labelKey;
  }
}


export function renderTypes(text, formatMessage) {
  const type = (text || '').toUpperCase();
  return TYPE_SET[type] ? formatMessage({ id: TYPE_SET[type] }) : type;
}

export function renderZoneTypes(text, formatMessage) {
  const type = (text || '').toUpperCase();
  return ZONE_TYPE[type] ? formatMessage({ id: ZONE_TYPE[type] }) : type;
}

export function renderProgress(value, record) {
  return value && value !== 'NONE' ? <span>{value}<Progress strokeWidth={5} percent={record.taskPercentage} /></span> : null
}

export function renderInnerIps(text, record) {
  let ips = [];
  record.ports.map(item => {
    if(!item.isExternal){
      ips.push(item.ip)
    }
  })
  return ips.join();
}

export function renderFloatingIp(text,record) {
  let floatingIps = [];
  let isFirst = false;
  record.ports.map(item => {
    if(item.isExternal && !isFirst){
      isFirst = true;
      floatingIps = [item.ip].concat(floatingIps)
    }else if(item.isExternal){
      floatingIps.push(item.ip);
    }else{
      if(item.floatingIP){
        floatingIps.push(item.floatingIP.floatingIpAddress);
      }
    }
  })
  const [first, ...rest] = floatingIps;
  const protocol = record.systemName.toUpperCase() === 'WINDOWS' ?
    'cloudrdp://' : 'ssh://';
  return (
    <span>
      <div><a href={`${protocol}${first}`}>{first}</a></div>
      {
        rest.length === 0 ? null : <span>{rest.join()}</span>
      }
    </span>
  )
}

export function workflowTip() {
  let toWorkflow = false;
  if (isAdmin()) {
    toWorkflow = false;
  } else if (enableWorkflow()) {
    toWorkflow = true;
  } else {
    toWorkflow = false;
  }
  return toWorkflow;
}

export function checkKeypairName(formatMessage) {
  const errorTips = formatMessage({ id: 'Utils_Data_Check_Name' }) +
    formatMessage({ id: 'Utils_Data_KepairName_Format_Tips' });
  return (
    function keypairNameCheck(rule, value, callback) {
      if (value && !/^[a-zA-Z0-9_][A-Za-z0-9_\-]*$/.test(value)) {
        callback(new Error(errorTips));
      } else {
        callback();
      }
    }
  );
}

export function checkKeyName(formatMessage) {
  return (
    function keypairNameCheck(rule, value, callback) {
      if (value && !/^[a-zA-Z0-9][A-Za-z0-9\-]*$/.test(value)) {
        callback(new Error(formatMessage({ id: 'Utils_Data_Check_Key' })));
      } else {
        callback();
      }
    }
  );
}

export function checkDockerName(formatMessage) {
  return (
    function DockerNameCheck(rule, value, callback) {
      if (value && !/^[a-z0-9][a-z0-9]*$/.test(value)) {
        callback(new Error(formatMessage({ id: 'Utils_Data_Check_Docker' })));
      } else {
        callback();
      }
    }
  );
}

// export function checkResourceName(formatMessage) {
//   return (
//     function keypairNameCheck(rule, value, callback) {
//       if (value && !/^[a-zA-Z0-9][A-Za-z0-9\-]*$/.test(value)) {
//         callback(new Error(formatMessage({ id: 'Utils_Data_Check_Name' })));
//       } else {
//         callback();
//       }
//     }
//   );
// }

// export function checkShowName(formatMessage) {
//   return (
//     function zhLetterCheck(rule, value, callback) {
//       if (value && !/[a-zA-Z_\-]*[\u4e00-\u9fa5]*/.test(value)) {
//         callback(new Error(formatMessage({ id: 'Utils_Data_Check_Name' })));
//       } else {
//         callback();
//       }
//     }
//   );
// }

// export function checkLetterName(formatMessage) {
//   return (
//     function LetterCheck(rule, value, callback) {
//       if (value && !/^[A-Za-z]+$/.test(value)) {
//         callback(new Error(formatMessage({ id: 'Utils_Data_Check_Name' })));
//       } else {
//         callback();
//       }
//     }
//   );
// }

export function checkUrl(formatMessage) {
  return (
    function UrlCheck(rule, value, callback) {
      if (value && !/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/.test(value)) {
        callback(new Error(formatMessage({ id: 'Utils_Data_Check_Name' })));
      } else {
        callback();
      }
    }
  );
}

export function checkNameRepeat(array, formatMessage) {
  return (
    function nameRepeatCheck(rule, value, callback) {
      if (value && value.length > 32) {
        callback(new Error(formatMessage({ id: 'Name_Length_Warning' })));
      } else if (value && checkDuplicate(array, value)) {
        callback(new Error(formatMessage({ id: 'Name_Existed' })));
      } else {
        callback();
      }
    }
  );
}

export function checkFloatingIPSRepeat(array, formatMessage) {
  return (
    function floatingIPRepeatCheck(rule, value, callback) {
      if (value) {
        if (value && !/^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/.test(value)) {
          callback(new Error(formatMessage({ id: 'Utils_Data_Check_IP' })));
        }
        for(const data in array){
          if(array[data]['floatingIpAddress'] == value){
            callback(new Error(formatMessage({ id: 'FloatingIP_BasicInfo_FloatingIPExistence' })));
          }
        }
        callback();
      } else {
        callback();
      }
    }
  );
}

export function checkTerminalRepeat(array, formatMessage) {
  return (
    function terminalRepeatCheck(rule, value, callback) {
      if (checkTerminal(array, value)) {
        callback(new Error(formatMessage({ id: 'Terminal_Existed' })));
      } else {
        callback();
      }
    }
  );
}

export function checkDescriptionLength(formatMessage) {
  return (
    function descriptionLengthCheck(rule, value, callback) {
      if (value && value.length > 256) {
        callback(new Error(formatMessage({ id: 'Description_Length_Warning' })));
      } else {
        callback();
      }
    }
  );
}

export function checkBasicName(list, name, formatMessage, cname) {
  let content = '';
  if (name === cname) {
    content = 'cancel';
  } else if (name.trim() === '') {
    content = formatMessage({ id: 'Alarm_BasicInfo_InputName' });
  } else if (name.length > 32) {
    content = formatMessage({ id: 'Name_Length_Warning' });
  } else if (checkDuplicate(list, name)) {
    content = formatMessage({ id: 'Name_Existed' });
  } else if (!nameFormat(name)) {
    content = formatMessage({ id: 'Utils_Data_Check_Name' }) +
    formatMessage({ id: 'Utils_Data_Name_Format_Tips' });
  } else {
    content = false;
  }

  return content;
}

export function checkDisplayName(name, formatMessage, cname) {
  let content = '';
  if (name === cname) {
    content = 'cancel';
  } else if (name.trim() === '') {
    content = formatMessage({ id: 'Common_Input_DisplayName' });
  } else if (name.length > 32) {
    content = formatMessage({ id: 'Common_DisplayName_Length_Warning' });
  } else if (nameSpace(name)) {
    content = formatMessage({ id: 'Common_DisplayName_NoSpace' });
  } else {
    content = false;
  }

  return content;
}


export function checkBasicDescription(description, formatMessage, cdescription) {
  let content = '';
  if (description === cdescription) {
    content = 'cancel';
  } else if (description.length > 256) {
    content = formatMessage({ id: 'Description_Length_Warning' });
  } else {
    content = false;
  }

  return content;
}

// filter the table or card's columns to display
export function filterTableColumn(columns, hiddenColumns) {
  return columns.filter(column => !hiddenColumns.includes(column.key));
}

export function filterCardColumn(data, hiddenColumns) {
  const filterData = data.map(item => {
    return {
      ...item,
      displayData: {
        ...item.displayData,
        titleItems: item.displayData.titleItems.filter(title => !hiddenColumns.includes(title.key)),
        contentItems: item.displayData.contentItems.filter(contentItems => !hiddenColumns.includes(contentItems.key)),
      },
    };
  });
  return filterData;
}

export function flattenTenants(topLevelTenants) {
  let tenants = topLevelTenants;
  topLevelTenants.forEach(topLevelTenant => {
    let subTenants = topLevelTenant.tenants;
    if (subTenants && subTenants.length > 0) {
      tenants = tenants.concat(flattenTenants(subTenants));
    }
  });
  return tenants;
}

export function flattenFirstTenants(topLevelTenants) {
  let tenants = topLevelTenants;
  topLevelTenants.forEach(topLevelTenant => {
    let firstTenants = topLevelTenant.tenants;
    if (firstTenants && firstTenants.length > 0) {
      tenants = tenants.concat(firstTenants);
    }
  });
  return tenants;
}

export function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

export function handleTimeSort(order, a, b){
  let sort = 0;
  const descend = order === 'descend';
  if (!a&&!b) {
    sort = 0;
  } else if (!a) {
    sort = descend ? -1 : 1;
  } else if (!b) {
    sort = descend ? 1 : -1;
  } else {
    sort = new Date(a) - new Date(b);
  }

  return sort;
}

export function filterInstanceSelect(data){
  const newData = Array.isArray(data) ? data.filter(item => !(item.source
    && item.source.toLowerCase() !== 'openstack')) : [];

  return newData;
}

export function filterVolumeSelect(data) {
  const newData = data.filter(item => !(item.source
  && item.source.toLowerCase() !== 'openstack'
  && item.source.toLowerCase() !== 'kubernetes'));

  return newData;
}

export function renderSwap(arr, index) {
  if (index > 0) {
    const current = arr.splice(index, 1)[0];
    arr.unshift(current);
  }
  return arr;
}

export function checkInputNumber(inputValue, max, min = 0) {
  if (isNaN(inputValue) || inputValue < min) {
    return min;
  } else if (inputValue > max) {
    return max;
  }
  return inputValue;
}

export function checkboxChange(pThis) {
  return (
    function handleChange(record, selected, selectedRows) {
      if (selected) {
        pThis.setState({
          selectedRowKeys: [record.id],
          selectedRows: [record],
        });
      } else {
        pThis.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });
      }
    }
  );
}

export function tableChange(pThis) {
  return (
    function handleTableChange(pagination, filters, sorter) {
      pThis.setState({
        sortedInfo: {
          order: sorter.order,
          columnKey: sorter.columnKey,
        },
      });
    }
  );
}

export function renderAvailabilityZoneName(row) {
  return row.availabilityZoneName || null;
}

export function checkNameSpace(formatMessage) {
  const errorTips = formatMessage({ id: 'Utils_Data_NameNoSpace' });
  return (
    function nameFormatCheck(rule, value, callback) {
      if (value && /\s/g.test(value)) {
        callback(new Error(errorTips));
      } else {
        callback();
      }
    }
  );
}
