import { defineComponent, inject } from 'vue'
import { defaultConfigProvider, ConfigProviderKey } from '../config-provider'

const Header = defineComponent({
    name: 'WandererHeader',
    setup(props, { slots }) {
        const { getPrefixCls } = inject(ConfigProviderKey, defaultConfigProvider)
        const prefixCls = getPrefixCls('layout-header')
        return () => {
            return (
                <header class={prefixCls}>
                    { slots.default?.() }
                </header>
            )
        }
    }
})

export default Header
