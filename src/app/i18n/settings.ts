export const fallbackLng = 'en-US';
export const languages = [fallbackLng, 'sv-SE', 'zh-CN'];
export const defaultNS = 'translation';

export enum Namespaces {
  translation = 'translation',
  auth = 'auth',
  dashboard = 'dashboard',
}

export const cookieName = 'i18next';

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  };
}
