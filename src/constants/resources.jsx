export const RESOURCES_MAP = {
  instance: 'instances',
  image: 'images',
  volume: 'volumes',
  volumeType: 'volumeTypes',
  network: 'networks',
  subnet: 'subnets',
  floatingip: 'floating-ips',
  router: 'routers',
  port: 'ports',
  host: '',
  keypair: 'keypairs',
  flavor: '',
  securityGroup: 'security-groups',
  firewall: 'firewall-services',
  loadbalancer: 'load-balancers',
  loadbalance: 'loadbalancers-service',
  vpn: 'vpns',
  physical: 'physical-servers',
  container: 'container-services',
  notificationlist: 'notification-lists',
  monitor: 'alarms',
  hostAggregate: 'zones',
  monitorTemplate: 'monitorTemplates',
  pool: 'pools',
};

export const RESOURCES_NAME = {
  instance: 'Common_Label_Instance',
  image: 'Common_Label_Image',
  volume: 'Common_Label_Volume',
  network: 'Common_Label_Network',
  subnet: 'Common_Label_Subnet',
  floatingip: 'Common_Label_FloatingIP',
  router: 'Common_Label_Router',
  port: 'Common_Label_Port',
  keypair: 'Common_Label_Keypair',
  securityGroup: 'Common_Label_SecurityGroup',
  firewall: 'Common_Label_Firewall',
  loadbalancer: 'Common_Label_Loadbalancer',
  vpn: 'Common_Label_VPN',
  bareMetal: 'Common_Label_BareMetal',
  service: 'Common_Label_Service',
  physical: 'Common_Label_Physical',
  vdiInstance: 'Common_Label_VDI',
  backup: 'Common_Label_Backup',
  snapshot: 'Common_Label_Snapshot',
  k8scontainer: 'Common_Label_k8scontainer',
  container: 'Common_Label_Container',
  database: 'Common_Label_Database',
  stack: 'Common_Label_Stack',
};

const QUOTA_ICON_TYPE = {
  'instance': 'instance.png',
  'ram': 'mem.png',
  'core': 'cpu.png',
  'security-group': 'security-group.png',
  'keypair': 'security-key.png',
  'performance': '&#xe697;',
  'capacity': '&#xe697;',
  'BGP': '&#xe694;',
  'CUCC': '&#xe694;',
  'CTCC': '&#xe694;',
  'CMCC': '&#xe694;',
};
export function quotaIcon(type) {
  const defaultIcon = 'compute.png';
  if (type) {
    const typeArr = type.split('_');
    return QUOTA_ICON_TYPE[typeArr[typeArr.length - 1]] || defaultIcon;
  } else {
    return defaultIcon;
  }
}

export function quotaFont(type) {
  const defaultFont = '&#xe697;';
  if (type) {
    const typeArr = type.split('_');
    return QUOTA_ICON_TYPE[typeArr[typeArr.length - 1]] || defaultFont;
  } else {
    return defaultFont;
  }
}

export const typeToIcon = {
  performance: '&#xe6aa;',
  capacity: '&#xe6ab;',
  image: '&#xe644;',
  snapshot: '&#xe65e;',
  backup: '&#xe647;',
  CMCC: '&#xe6ac;',
  CTCC: '&#xe6a7;',
  CUCC: '&#xe6a9;',
  BGP: '&#xe694;',
};

const RESOURCE_NAMES = {
  'maas': 'Resource_Name_MAAS',
  'vpnaas': 'Resource_Name_VPNAAS',
  'fwaas': 'Resource_Name_FWAAS',
  'lbaas': 'Resource_Name_LBAAS',
  'dbaas': 'Resource_Name_DBAAS',
  'caas': 'Resource_Name_CAAS',
  'vdi-zone_core': 'Resource_Name_VDI_Zone_Core',
  'kvm-zone_core': 'Resource_Name_KVM_Zone_Core',
  'vmware-zone_core': 'Resource_Name_VMware_Zone_Core',
  'container-zone_core': 'Resource_Name_Container_Zone_Core',
  'baremetal-zone_core': 'Resource_Name_BareMetal_Zone_Core',
  'database-zone_core': 'Resource_Name_DataBase_Zone_Core',
  'vdi-zone_ram': 'Resource_Name_VDI_Zone_Ram',
  'kvm-zone_ram': 'Resource_Name_KVM_Zone_Ram',
  'vmware-zone_ram': 'Resource_Name_VMware_Zone_Ram',
  'container-zone_ram': 'Resource_Name_Container_Zone_ram',
  'baremetal-zone_ram': 'Resource_Name_BareMetal_Zone_ram',
  'database-zone_ram': 'Resource_Name_DataBase_Zone_Ram',
  'ctcc': 'Resource_Name_CTCC',
  'performance': 'Resource_Name_Performance',
  'capacity': 'Resource_Name_Capacity',
};

export function getResourceName(formatMessage, type) {
  return RESOURCE_NAMES[type.toLowerCase()] ? formatMessage({ id: RESOURCE_NAMES[type.toLowerCase()] }) : type;
}
