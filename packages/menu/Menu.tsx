import type { PropType, ExtractPropTypes } from 'vue'
import type { Key, MenuMode, MenuInfo, TriggerSubMenuAction } from './interface'

import { defineComponent, computed, ref } from 'vue'
import useConfigReceiver from '../hook/useConfigReceiver'
import { useMenuContextReceiver } from './hook/useMenuContext'

export const menuProps = {
    defaultSubMenuOpened: Boolean,
    activeKey: { type: [String, Number] as PropType<Key>, default: '' },
    openKeys: { type: Array as PropType<Key[]>, default() { return [] } },
    mode: { type: String as PropType<MenuMode>, default: 'vertical' },
    triggerSubMenuAction: { type: String as PropType<TriggerSubMenuAction>, default: 'hover' }
}

export type MenuProps = Partial<ExtractPropTypes<typeof menuProps>>

const Menu = defineComponent({
    name: 'WandererMenu',
    props: menuProps,
    emits: ['update:activeKey', 'update:openKeys', 'openChange', 'click'],
    setup(props, { slots, emit }) {
        const mode = ref<MenuMode>(props.mode)
        const defaultSubMenuOpened = ref<boolean>(false)
        const openKeys = ref<Key[]>(props.openKeys)
        const activeKey = ref<Key>(props.activeKey)
        const triggerSubMenuAction = ref<TriggerSubMenuAction>(props.triggerSubMenuAction)

        const onItemClick = (info: MenuInfo) => {
            emit('click', info)
        }

        const changeActiveKey = (key: Key) => {
            activeKey.value = key
            emit('update:activeKey', key)
        }

        const onOpenChange = (key: Key, open: boolean) => {
            openKeys.value = openKeys.value.filter(k => k !== key)
            if (open) { openKeys.value.push(key) }
            emit('update:openKeys', openKeys.value)
            emit('openChange', openKeys.value)
        }

        useMenuContextReceiver({
            mode,
            openKeys,
            activeKey,
            defaultSubMenuOpened,
            triggerSubMenuAction,
            onItemClick,
            onOpenChange,
            changeActiveKey,
        })

        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('menu')
        const menuCls = computed(() => {
            return [
                prefixCls,
                `${prefixCls}-${props.mode}`
            ]
        })

        return () => {
            return (
                <ul class={menuCls.value}>
                    {slots.default?.()}
                </ul>
            )
        }
    }
})

export default Menu
