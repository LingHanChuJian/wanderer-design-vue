import type { ExtractPropTypes, PropType, UnwrapNestedRefs, InjectionKey } from 'vue'

import zh_CN from '../locales/zh_CN'
import { defineComponent, reactive, provide } from 'vue'

export interface Locale {
    [key: string]: string | string[] | Locale
}

export const configProviderProps = {
    prefixCls: { type: String, default: 'wanderer'},
    locale: { type: Object as PropType<Locale>, default: zh_CN }
}

type ConfigProviderPropsType = ExtractPropTypes<typeof configProviderProps>

export type ConfigProviderProps = Partial<ConfigProviderPropsType>

export interface ConfigHookProviderKey extends ConfigProviderPropsType {
    getPrefixCls: (suffixCls: string) => string
}

export const ConfigProviderKey: InjectionKey<ConfigHookProviderKey>  = Symbol('ConfigProvider')

const ConfigProvider = defineComponent({
    name: 'WandererConfigProvider',
    props: configProviderProps,
    setup(props, { slots }) {
        const getPrefixCls = (suffixCls: string) => {
            return `${props.prefixCls}-${suffixCls}`
        }
        const configProvider = reactive({
            ...props,
            getPrefixCls
        })
        provide(ConfigProviderKey, configProvider)
        return () => {
            return slots.default?.()
        }
    }
})

export const defaultConfigProvider: UnwrapNestedRefs<ConfigHookProviderKey> = reactive({
    prefixCls: 'wanderer',
    locale: zh_CN,
    getPrefixCls(suffixCls: string) {
        return `wanderer-${suffixCls}`
    }
})

export default ConfigProvider
