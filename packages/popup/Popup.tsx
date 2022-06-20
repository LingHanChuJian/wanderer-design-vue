import type { Placement, Strategy, VirtualElement, Middleware } from '@floating-ui/dom'
import type { TeleportProps, PropType, TransitionProps, ExtractPropTypes, CSSProperties } from 'vue'

import { offset, arrow } from '@floating-ui/dom'
import useFloating from '../hook/useFloating'
import useConfigReceiver from '../hook/useConfigReceiver'
import { defineComponent, Transition, Teleport, ref, computed, watch } from 'vue'

export const popupProps = {
    to: { type: String as PropType<TeleportProps['to']>, default: 'body' },
    teleported: Boolean,
    appear: Boolean,
    transitionName: { type: String, default: 'fade-in' },
    visible: Boolean,
    showArrow: Boolean,
    arrowPadding: { type: Number, default: 5 },
    offset: { type: Number, default: 8 },
    reference: { type: Object as PropType<HTMLElement | VirtualElement> },
    placement: { type: String as PropType<Placement>, default: 'bottom' },
    strategy: { type: String as PropType<Strategy>, default: 'absolute'}
}

export type PopupProps = Partial<ExtractPropTypes<typeof popupProps>>

const Popup = defineComponent({
    name: 'WandererPopup',
    props: popupProps,
    setup(props, { slots }) {
        const { getPrefixCls } = useConfigReceiver()
        const prefixCls = getPrefixCls('popup')

        const transitionProps: TransitionProps = {
            appear: props.appear,
            name: getPrefixCls(props.transitionName),
        }

        const placement = ref(props.placement)
        const strategy = ref(props.strategy)
        const arrowRef = ref<HTMLElement>()

        const { reference, floating, x, y, middlewareData, update } = useFloating({
            placement,
            strategy,
            middleware: computed(() => {
                const middleware: Middleware[] = [
                    offset(props.offset)
                ]
                if (props.showArrow && arrowRef.value) {
                    middleware.push(
                        arrow({
                            element: arrowRef.value,
                            padding: props.arrowPadding
                        })
                    )
                }
                return middleware
            })
        })

        watch(
            () => props.reference,
            el => {
                reference.value = el
            },
            { immediate: true }
        )
        
        watch(
            () => arrowRef,
            () => update(),
            { immediate: true }
        )
        
        const popupStyle = computed<CSSProperties>(() => {
            return {
                position: strategy.value,
                top: `${y.value || 0}px`,
                left: `${x.value || 0}px`
            }
        })

        const arrawStyle = computed<CSSProperties>(() => {
            if (!props.showArrow) { return {} }
            const { arrow } = middlewareData.value
            // const side = {}
            return {
                top: `${arrow?.y}` || '',
                left: `${arrow?.x}px` || '',
            }
        })

        const arraw = <span ref={arrowRef} class={`${prefixCls}-arraw`} style={arrawStyle.value} />
        return () => {
            return (
                <Teleport to={props.to} disabled={!props.teleported}>
                    <Transition {...transitionProps}>
                        <div v-show={props.visible} class={prefixCls} ref={floating} style={popupStyle.value}>
                            { !!props.showArrow ?  arraw : '' }
                            { slots.defalut?.() }
                        </div>
                    </Transition>
                </Teleport>
            )
        }
    }
})

export default Popup
