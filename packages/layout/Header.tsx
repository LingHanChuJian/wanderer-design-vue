import { defineComponent } from 'vue'
import useConfigReceiver from '../hook/useConfigReceiver'

const Header = defineComponent({
    name: 'WandererHeader',
    setup(props, { slots }) {
        const { getPrefixCls } = useConfigReceiver()
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
