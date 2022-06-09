import type { App } from 'vue'

import Layout from './Layout'
import Header from './Header'
import Sider from './Sider'
import Content from './Content'
import Footer from './Footer'

export type { SiderProps } from './Sider'

export {
    Header,
    Sider,
    Content,
    Footer
}

export default Object.assign(Layout, {
    Header,
    Sider,
    Content,
    Footer,
    install(app: App) {
        app.component(Layout.name, Layout)
        app.component(Header.name, Header)
        app.component(Sider.name, Sider)
        app.component(Content.name, Content)
        app.component(Footer.name, Footer)
        return app
    }
})
