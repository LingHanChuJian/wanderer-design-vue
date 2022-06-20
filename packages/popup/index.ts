import type { App } from 'vue'

import Popup from './Popup'

export type { PopupProps } from './Popup'

export default Object.assign(Popup, {
    install(app: App) {
        app.component(Popup.name, Popup)
        return app
    }
})