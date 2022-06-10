import { defineComponent } from 'vue'
import useConfigReceiver from '../hook/useConfigReceiver'

const Content = defineComponent({
    name: 'WandererContent',
    setup(props, { slots }) {
        return () => {
            const { getPrefixCls } = useConfigReceiver()
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
