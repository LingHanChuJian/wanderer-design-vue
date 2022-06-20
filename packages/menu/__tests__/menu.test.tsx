import type { VNode } from 'vue'

import Menu from '..'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, test } from 'vitest'

const { SubMenu, MenuItem } = Menu

const _mount = (render: () => VNode) => {
    return mount(render, { attachTo: document.body })
}

describe('Menu.tsx', () => {
    test('')
})
