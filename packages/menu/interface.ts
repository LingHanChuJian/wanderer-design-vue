export type Key = string | number

export type MenuMode = 'horizontal' | 'vertical'

export type TriggerSubMenuAction = 'click' | 'hover'

export type MenuClickEventHandler = (info: MenuInfo) => void

export interface MenuInfo {
    key: Key
    domEvent: MouseEvent | KeyboardEvent
}
