import type { Locale } from '../config-provider'

import { get } from 'lodash-unified'
import useConfigReceiver from './useConfigReceiver'

export type Options = Record<string, string | number>
export type Translator = (path: string, option?: Options) => string

export interface LocaleContext {
    lang: string
    locale: Locale
    t: Translator
}

export const translate = (path: string, options: Options | undefined, locale: Locale): string => {
    return (get(locale, path, path) as string).replace( /\{(\w+)\}/g, (_, key) => `${options?.[key] ?? `{${key}}`}`)
}

const useLocaleReceiver = (): LocaleContext => {
    const { locale } = useConfigReceiver()
    return {
        lang: locale.lang as string,
        locale: locale,
        t: (path: string, options?: Options) => translate(path, options, locale)
    }
}

export default useLocaleReceiver
