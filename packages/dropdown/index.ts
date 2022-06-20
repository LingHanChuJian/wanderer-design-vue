import type { App } from 'vue'

import Dropdown from './Dropdown'

export type { DropdownPorops } from './Dropdown'

export default Object.assign(Dropdown, {
    insatll(app: App) {
        app.component(Dropdown.name, Dropdown)
        return app
    }
})
