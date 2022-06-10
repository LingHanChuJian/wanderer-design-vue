import type { InjectionKey } from 'vue'
import type { ConfigProviderPropsType } from '.'

export interface ConfigHookProviderKey extends ConfigProviderPropsType {
    getPrefixCls: (suffixCls: string) => string
}

export const ConfigProviderKey: InjectionKey<ConfigHookProviderKey>  = Symbol('ConfigProvider')
