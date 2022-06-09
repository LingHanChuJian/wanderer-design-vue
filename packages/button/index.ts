import type { App, Plugin } from 'vue'

import Button from './Button'

Button.install = function(app: App) {
    app.component(Button.name, Button)
    return app
}

export default Button as typeof Button & Plugin
