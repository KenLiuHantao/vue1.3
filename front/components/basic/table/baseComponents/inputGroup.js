import inputOption from './inputOptionGroup.js'

export default {
    components: {
        'input-option': inputOption
    },
    name: 'init-input',
    props: ['conf', 'item'],
    template: "<input :style='sty' type='text' v-model='item[conf.key]'>" +
        "<template v-if='conf.sub'>" +
        "<input-option v-for='it in conf.sub' :conf='it' :item.sync='item'></input-option>" +
        "</template>",
    computed: {
        sty() {
            let obj = {
                width: this.conf.width ? this.conf.width : false,
                display: "block",
                margin: "3px 0"
            }
            return obj
        }
    }
}
