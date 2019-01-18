import MESSAGES_ZH from '../constants/messages_zh';
import MESSAGES_EN from '../constants/messages_en';
import { getLocale } from './auth';
import { workflowTip } from './data';

const MESSAGES = {
  zh: MESSAGES_ZH,
  en: MESSAGES_EN,
};

export default function message(key) {
  const language = getLocale();
  let displayKey = workflowTip() ? key + '_WORKFLOW' : key;
  const messageJSON = MESSAGES[language] || MESSAGES.zh;
  return messageJSON[displayKey] || messageJSON[key] || key || displayKey;
}
