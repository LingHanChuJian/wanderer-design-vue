import type { RouteLocationRaw } from 'vue-router'

import { useRouter, useRoute } from 'vue-router'

export type Target = '_self' | '_blank' | '_parent' | '_top'

export interface LinkOptions {
    to: RouteLocationRaw,
    replace?: boolean,
    target?: Target
}

export const useLinkReceiver = (options: LinkOptions) => {
    const route = useRoute()
    const router = useRouter()

    const internalLink = (e: MouseEvent, newWindow: boolean) => {
        e.preventDefault()
        if (options.target === '_blank') { return }
        let to = options.to
        if (newWindow) {
            if (router) {
                const r = router.resolve(to, route)
                to = r ? r.href : to
            }
            window.open(to as string)
        } else {
            if (router) {
                options.replace ? router.replace(to) : router.push(to)
                return
            }
            window.location.href = to as string
        }
    }

    return internalLink
}
