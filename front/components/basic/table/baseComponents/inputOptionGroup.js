import sInput from './sInput'

export default {
    name: 'inpitem',
    props: ['conf', 'item'],
    template: "<s-input v-if='conf.inputGroup' :conf='conf' :item.sync='item'></s-input>" +
        "<inp v-if='conf.calculation' :style='{width:conf.width?conf.width:0}' type='text' v-model='item[conf.key] | caculation tb index' :key='conf.limit'></inp>" +
        "<inp v-if='conf.limit && !conf.calculation' :style='{width:conf.width?conf.width:0}' :code.sync='item[conf.key]' :key='conf.limit'></inp>" +
        "<template v-if='conf.sub'>" +
        "   <inpitem v-for='t in conf.sub' :conf='t' :item.sync='item'></inpitem>" +
        "</template>" +
        "<input v-if='!conf.inputGroup' :style='{width:conf.width?conf.width:0}' type='text' v-model='item[conf.key]'>",
    components: {
        's-input': sInput
    }
}
