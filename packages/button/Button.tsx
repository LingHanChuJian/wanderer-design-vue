import { defineComponent } from 'vue'

const Button = defineComponent({
    name: 'WandererButton',
    setup(props, { slots }) {
        console.log(props)
        return () => {
            return (<button class="btn">{ slots.default?.() }</button>)
        }
    }
})

export default Button
