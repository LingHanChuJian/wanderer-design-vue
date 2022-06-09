import type { App, Plugin } from 'vue'
import * as components from './packages'

import version from './version'

const install = (app: App) => {
    Object.keys(components).forEach(key => {
        const component = components[key as keyof typeof components]
        if (component.install) {
            app.use(component as Plugin)
        }
    })
    // app.config.globalProperties.$Message =
    return app
}

export * from './packages'
export * from './hook'

export default {
    version,
    install
}
