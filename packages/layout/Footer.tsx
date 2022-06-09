import { defineComponent, inject } from 'vue'
import { defaultConfigProvider, ConfigProviderKey } from '../config-provider'

const Footer = defineComponent({
    name: 'WandererFooter',
    setup(props, { slots }) {
        return () => {
            const { getPrefixCls } = inject(ConfigProviderKey, defaultConfigProvider)
            const prefixCls = getPrefixCls('layout-footer')
            return (
                <footer class={prefixCls}>
                    {slots.default?.()}
                </footer>
            )
        }
    }
})

export default Footer
