import type { ExtractPropTypes, TransitionProps, RendererElement } from 'vue'

import { defineComponent, Transition } from 'vue'
import useConfigReceiver from '../hook/useConfigReceiver'

export const dropdownPorops = {
    appear: Boolean,
    visible: Boolean
}

export type DropdownPorops = Partial<ExtractPropTypes<typeof dropdownPorops>>

const Dropdown = defineComponent({
    name: 'WandererDropdown',
    props: dropdownPorops,
    setup(props, { slots }) {
        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('dropdown')

        const transitionProps: TransitionProps = {
            name: prefixCls,
            appear: props.appear,
            onBeforeEnter(el: RendererElement) {
                el.dataset.oldPaddingTop = el.style.paddingTop
                el.dataset.oldPaddingBottom = el.style.paddingBottom

                el.style.maxHeight = 0
                el.style.paddingTop = 0
                el.style.paddingBottom = 0
            },
            onEnter(el: RendererElement) {
                el.dataset.oldOverflow = el.style.overflow

                el.style.maxHeight = el.scrollHeight !== 0 ? `${el.scrollHeight}px` : 0
                el.style.paddingTop = el.dataset.oldPaddingTop
                el.style.paddingBottom = el.dataset.oldPaddingBottom
                el.style.overflow = 'hidden'
            },
            onAfterEnter(el: RendererElement) {
                el.style.maxHeight = ''
                el.style.overflow = el.dataset.oldOverflow
            },
            onBeforeLeave(el: RendererElement) {
                el.dataset.oldPaddingTop = el.style.paddingTop
                el.dataset.oldPaddingBottom = el.style.paddingBottom
                el.dataset.oldOverflow = el.style.overflow

                el.style.maxHeight = `${el.scrollHeight}px`
                el.style.overflow = 'hidden'
            },
            onLeave(el: RendererElement) {
                if (el.scrollHeight !== 0) {
                    el.style.maxHeight = 0
                    el.style.paddingTop = 0
                    el.style.paddingBottom = 0
                }
            },
            onAfterLeave(el: RendererElement) {
                el.style.maxHeight = ''
                el.style.overflow = el.dataset.oldOverflow
                el.style.paddingTop = el.dataset.oldPaddingTop
                el.style.paddingBottom = el.dataset.oldPaddingBottom
            },
        }

        return () => {
            return (
                <Transition {...transitionProps}>
                    <div v-show={props.visible} class={prefixCls}>
                        { slots.default?.()}
                    </div>
                </Transition>
            )
        }
    }
})

export default Dropdown
