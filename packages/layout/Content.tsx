import { defineComponent, inject } from 'vue'
import { defaultConfigProvider, ConfigProviderKey } from '../config-provider'

const Content = defineComponent({
    name: 'WandererContent',
    setup(props, { slots }) {
        return () => {
            const { getPrefixCls } = inject(ConfigProviderKey, defaultConfigProvider)
            const prefixCls = getPrefixCls('layout-content')
            return (
                <main class={prefixCls}>
                    {slots.default?.()}
                </main>
            )
        }
    }
})

export default Content
