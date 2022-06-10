import { defineComponent } from 'vue'
import useConfigReceiver from '../hook/useConfigReceiver'

const Footer = defineComponent({
    name: 'WandererFooter',
    setup(props, { slots }) {
        return () => {
            const { getPrefixCls } = useConfigReceiver()
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
