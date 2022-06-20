import type { ExtractPropTypes } from 'vue'

import uuid from '../utils/uuid'
import isNumeric from '../utils/isNumeric'
import useConfigReceiver from '../hook/useConfigReceiver'
import { SiderCollapsedKey, SiderHookProviderKey } from './interface'
import { defineComponent, inject, ref, watch, provide, onMounted, onBeforeUnmount, computed } from 'vue'

export const siderProps = {
    collapsed: Boolean,
    width: { type: [String, Number], default: 250 },
    collapsedWidth: { type: [String, Number], default: 0 },
    matchMedia: { type: Boolean, default: true },
    matchMediaWidth: { type: [String, Number], default: 860 }
}

export type SiderProps = Partial<ExtractPropTypes<typeof siderProps>>

const siderKey = uuid()

const Sider = defineComponent({
    name: 'WandererSider',
    props: siderProps,
    emits: ['update:collapsed'],
    setup(props, { slots, emit }) {
        const collapsed = ref(!!props.collapsed)
        watch(
            () => props.collapsed,
            () => {
                collapsed.value = !!props.collapsed
            }
        )
        provide(SiderCollapsedKey, collapsed)
        
        const handleCollapsed = (value: boolean) => {
            collapsed.value = value
            emit('update:collapsed', value)
        }

        let mql: MediaQueryList
        const handleMatchMedia = (event: MediaQueryListEvent | MediaQueryList) => {
            if (collapsed.value !== event.matches) {
                handleCollapsed(event.matches)
            }
        }

        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('layout-sider')
        const siderCls = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-collapsed`]: collapsed.value
                }
            ]
        })
        const rawWidth = collapsed.value ? props.width : props.collapsedWidth
        const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth)
        const siderStyle = {
            flex: `0 0 ${siderWidth}`,
            maxWidth: siderWidth, // Fix width transition bug in IE11
            minWidth: siderWidth,
            width: siderWidth,
        }

        const id = siderKey(prefixCls)
        const siderHook = inject(SiderHookProviderKey)

        onMounted(() => {
            if (typeof window !== 'undefined' && props.matchMedia) {
                const { matchMedia } = window
                mql = matchMedia(`(max-width: ${props.matchMediaWidth}px)`)
                mql.addEventListener('change', handleMatchMedia)
                handleMatchMedia(mql)
            }

            siderHook?.addSider?.(id)
        })

        onBeforeUnmount(() => {
            mql?.removeEventListener('change', handleMatchMedia)
            siderHook?.removeSider?.(id)
        })

        return () => {
            return (
                <aside class={siderCls.value} style={siderStyle}>
                    <div class={`${prefixCls}-children`}>{ slots.default?.() }</div>
                </aside>
            )
        }
    }
})

export default Sider
