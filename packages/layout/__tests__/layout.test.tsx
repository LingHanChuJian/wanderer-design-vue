import type { VNode } from 'vue'

import Layout from '..'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, test, expect, beforeAll, vi } from 'vitest'

const { Sider, Header, Content, Footer } = Layout

const slotsContent = 'Tokisaki Kurumi is the best girl'

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        value: vi.fn(() => {
            return {
                matches: true,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                addListener: vi.fn(),
                removeListener: vi.fn()
            }
        })
    })
})

const _mount = (render: () => VNode) => {
    return mount(render, { attachTo: document.body })
}

describe('Layout.tsx', () => {
    test('create', async () => {
        const wrapper = _mount(() => (
            <Layout>
                <Sider />
                <Layout>
                    <Header />
                    <Content />
                    <Footer />
                </Layout>
            </Layout>
        ))
        await nextTick()
        expect(wrapper.find('.wanderer-layout').exists()).toBe(true)
        expect(wrapper.find('.wanderer-layout-sider').exists()).toBe(true)
        expect(wrapper.find('.wanderer-layout-header').exists()).toBe(true)
        expect(wrapper.find('.wanderer-layout-content').exists()).toBe(true)
        expect(wrapper.find('.wanderer-layout-footer').exists()).toBe(true)
    })

    test('render slots test', async () => {
        const layout = _mount(() => <Layout>{slotsContent}</Layout>)
        const sider = _mount(() => <Layout><Sider>{slotsContent}</Sider></Layout>)
        const header = _mount(() => <Header>{slotsContent}</Header>)
        const content = _mount(() => <Content>{slotsContent}</Content>)
        const footer = _mount(() => <Footer>{slotsContent}</Footer>)
        await nextTick()
        expect(layout.text()).toEqual(slotsContent)
        expect(sider.text()).toEqual(slotsContent)
        expect(header.text()).toEqual(slotsContent)
        expect(content.text()).toEqual(slotsContent)
        expect(footer.text()).toEqual(slotsContent)
    })
    
    test('detect the sider as children', async () => {
        const wrapper = _mount(() => (
            <Layout>
                <Sider></Sider>
                <Content></Content>
            </Layout>
        ))
        await nextTick()
        expect(wrapper.find('.wanderer-layout').classes()).toContain('wanderer-layout-has-sider')
    })
    
    test('detect the sider inside the children', async () => {
        const wrapper = _mount(() => (
            <Layout>
                <div>
                    <Sider></Sider>
                </div>
                <Content></Content>
            </Layout>
        ))
        await nextTick()
        expect(wrapper.find('.wanderer-layout').classes()).toContain('wanderer-layout-has-sider')
    })

})
