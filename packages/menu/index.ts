import type { App } from 'vue'

import Menu from './Menu'
import SubMenu from './SubMenu'
import MenuItem from './MenuItem'

export type { MenuProps } from './Menu'
export type { SubMenuProps } from './SubMenu'
export type { MenuItemProps } from './MenuItem'

export {
    SubMenu,
    MenuItem
}

export default Object.assign(Menu, {
    SubMenu,
    MenuItem,
    install(app: App) {
        app.component(Menu.name, Menu)
        app.component(SubMenu.name, SubMenu)
        app.component(MenuItem.name, MenuItem)
        return app
    }
})
