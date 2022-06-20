import type { ToRefs, Ref, ComputedRef } from 'vue'
import type { Middleware, Placement, ComputePositionReturn, Strategy, VirtualElement, SideObject } from '@floating-ui/dom'

import { unrefElement } from '@vueuse/core'
import { computePosition } from '@floating-ui/dom'
import { ref, isRef, onMounted, watchEffect } from 'vue'

export type FloatingOptions = {
    placement: Ref<Placement>
    middleware: ComputedRef<Middleware[]>
    strategy: Ref<Strategy>
}

export type ElementRef = Parameters<typeof unrefElement>['0']

export const unrefReference = (elRef: ElementRef | Ref<VirtualElement | undefined>) => {
    const unrefEl = unrefElement(elRef as ElementRef)
    if (unrefEl) { return unrefEl }
    return isRef(elRef) ? unrefEl : elRef as VirtualElement
}

const useFloating = (options: FloatingOptions) => {
    const reference = ref<Element | VirtualElement>()
    const floating = ref<HTMLElement>()
    const x = ref<number>(0)
    const y = ref<number>(0)
    const middlewareData = ref<ComputePositionReturn['middlewareData']>({})

    const states: ToRefs<ComputePositionReturn> = {
        x,
        y,
        middlewareData,
        ...options
    }
    
    const { placement, middleware, strategy } = options

    const update = async () => {
        const referenceEl = unrefReference(reference)
        const floatingEl = unrefElement(floating)
        if (!referenceEl || !floatingEl) { return }

        const data = await computePosition(referenceEl, floatingEl, {
            placement: placement.value,
            middleware: middleware.value,
            strategy: strategy.value
        })

        Object.keys(states).forEach(key => {
            states[key as keyof ComputePositionReturn].value = data[key as keyof ComputePositionReturn]
        })
    }

    onMounted(() => {
        watchEffect(() => update())
    })

    return {
        ...states,
        reference,
        floating,
        update
    }
}

export default useFloating
