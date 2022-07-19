import type { PropType, ExtractPropTypes } from 'vue'
import type { LinkOptions } from '../hook/useLinkReceiver'

import { devWarn } from '../utils/warn'
import { useLinkReceiver } from '../hook/useLinkReceiver'
import useConfigReceiver from '../hook/useConfigReceiver'
import { useMenuContextProvider } from './hook/useMenuContext'
import { defineComponent, computed, ref, watch } from 'vue'

export const menuItemProps = {
    name: { type: [String, Number], required: true },
    link: { type: [Object, String] as PropType<LinkOptions> },
    disabled: Boolean
}

export type MenuItemProps = Partial<ExtractPropTypes<typeof menuItemProps>>

const MenuItem = defineComponent({
    name: 'WandererMenuItem',
    props: menuItemProps,
    emits: ['click'],
    setup(props, { slots, emit }) {
        const { activeKey, onItemClick, changeActiveKey } = useMenuContextProvider()
        const active = ref(false)
        const key = ref(props.name)
        const disabled = ref(props.disabled)

        watch(
            activeKey,
            () => active.value = activeKey.value === key.value,
            { immediate: true }
        )

        const internalLink = props.link && useLinkReceiver(props.link)
        const onInternalClick = (e: MouseEvent) => {
            if (disabled.value) { return }
            if (internalLink) { return internalLink(e, e.ctrlKey || e.metaKey) }
            changeActiveKey(key.value!)
            onItemClick({ key: key.value!, domEvent: e })
            emit('click', e)
        }

        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('menu-item')
        const menuItemCls = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-active`]: active.value,
                    [`${prefixCls}-disabled`]: disabled.value
                }
            ]
        })

        return () => {
            return (
                <li class={menuItemCls.value} onClick={onInternalClick}>
                    {slots.default?.()}
                </li>
            )
        }
    }
})

export default MenuItem
