import type { Ref, InjectionKey } from 'vue'
import type { Key, MenuMode, MenuClickEventHandler, TriggerSubMenuAction } from '../interface'

import { provide, inject } from 'vue'

export interface MenuContextProvider {
    mode: Ref<MenuMode>
    openKeys: Ref<Key[]>
    activeKey: Ref<Key>
    defaultSubMenuOpened: Ref<boolean>
    triggerSubMenuAction: Ref<TriggerSubMenuAction>
    changeActiveKey: (keys: Key) => void
    onItemClick: MenuClickEventHandler
    onOpenChange: (key: Key, open: boolean) => void
}

export const MenuContextKey: InjectionKey<MenuContextProvider> = Symbol('MenuContext')

export const useMenuContextReceiver = (menuContext: MenuContextProvider) => {
    provide(MenuContextKey, menuContext)
}

export const useMenuContextProvider = () => {
    return inject(MenuContextKey) as MenuContextProvider
}
