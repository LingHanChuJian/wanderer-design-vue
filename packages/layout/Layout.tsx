import { SiderHookProviderKey } from './interface'
import useConfigReceiver from '../hook/useConfigReceiver'
import { defineComponent, ref, provide, computed } from 'vue'

const Layout = defineComponent({
    name: 'WandererLayout',
    setup(props, { slots }) {
        const siders = ref<string[]>([])
        const siderHookProvider = {
            addSider(id: string) {
                siders.value = [...siders.value, id]
            },
            removeSider(id: string) {
                siders.value = siders.value.filter(item => item !== id)
            }
        }
        provide(SiderHookProviderKey, siderHookProvider)

        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('layout')
        const layoutCls = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-has-sider`]: siders.value.length > 0 
                }
            ]
        })
        return () => {
            return (
                <section class={layoutCls.value}>
                    { slots.default?.() }
                </section>
            )
        }
    }
})

export default Layout
