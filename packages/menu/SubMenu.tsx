import type { PropType, ExtractPropTypes } from 'vue'
import type { LinkOptions } from '../hook/useLinkReceiver'

import Popup from '../popup'
import Dropdown from '../dropdown'
import ChevronDown from '~icons/fa/chevron-down'
import { useLinkReceiver } from '../hook/useLinkReceiver'
import useConfigReceiver from '../hook/useConfigReceiver'
import { useMenuContextProvider } from './hook/useMenuContext'
import { defineComponent, computed, ref } from 'vue'

export const subMenuProps = {
    name: { type: [String, Number], required: true },
    title: String,
    link: { type: Object as PropType<LinkOptions> },
    disabled: { type: Boolean, default: false}
}

export type SubMenuProps = Partial<ExtractPropTypes<typeof subMenuProps>>

const SubMenu = defineComponent({
    name: 'WandererSubMenu',
    props: subMenuProps,
    slots: ['title'],
    emits: ['click', 'mouseenter', 'mouseleave'],
    setup(props, { slots, emit }) {
        const { mode, defaultSubMenuOpened, triggerSubMenuAction, onOpenChange } = useMenuContextProvider()
        const key = ref(props.name)
        const disabled = ref(props.disabled)
        const opened = ref(mode.value === 'vertical' ? defaultSubMenuOpened.value : false)

        const internalLink = props.link && useLinkReceiver(props.link)
        const onInternalClick = (e: MouseEvent, skip: boolean) => {
            if (disabled.value) { return }
            if (!skip && internalLink) { return internalLink(e, e.ctrlKey || e.metaKey) }
            if (mode.value === 'horizontal' && triggerSubMenuAction.value === 'hover') { return }
            opened.value = !opened.value
            onOpenChange(key.value!, opened.value)
            emit('click', e)
        }

        const onMouseEnter = (e: MouseEvent) => {
            if (disabled.value) { return }
            if (mode.value === 'vertical') { return }
            if (triggerSubMenuAction.value === 'hover') {
                opened.value = true
                onOpenChange(key.value!, true)
            }
            emit('mouseenter', e)
        }

        const onMouseLeave = (e: MouseEvent) => {
            if (disabled.value) { return }
            if (mode.value === 'vertical') { return }
            if (triggerSubMenuAction.value === 'hover') {
                opened.value = false
                onOpenChange(key.value!, false)
            }
            emit('mouseleave', e)
        }

        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('menu-submenu')
        const submenuCls = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-opened`]: opened.value,
                    [`${prefixCls}-disabled`]: disabled.value,
                }
            ]
        })

        const reference = ref()

        const popup = (
            <Popup reference={reference.value} placement='bottom' visible={opened.value} showArrow>
                <ul class={`${prefixCls}-content`} >{slots.defalut?.()}</ul>
            </Popup>
        )
        
        const dropdown = (
            <Dropdown appear>
                <ul v-show={opened.value} class={`${prefixCls}-content`}>{slots.defalut?.()}</ul>
            </Dropdown>
        )

        return () => {
            return (
                <li
                    class={submenuCls.value}
                    onClick={e => onInternalClick(e, false)}
                    onMouseenter={onMouseEnter}
                    onMouseleave={onMouseLeave}
                >
                    <div class={`${prefixCls}-content`} ref={reference}>
                        <div class={`${prefixCls}-title`}>
                            {slots.title ? slots.title() : props.title}
                            { mode.value === 'vertical' ? <ChevronDown class={`${prefixCls}-arrow`} onClick={e => onInternalClick(e, true)}/> : '' }
                        </div>
                        {mode.value === 'vertical' ? dropdown : popup}
                    </div>
                </li>
            )
        }
    }
})

export default SubMenu
