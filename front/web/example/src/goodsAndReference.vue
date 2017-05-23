<script>
import send from 'nb/refer/sendReturn.vue'

export default {
    components: {
        send
    },
    data() {
        return {
            sendCfg: {
                show: false
            }
        }
    },
    methods: {
        getSend() {
            this.sendCfg.show = true
        },
        getItem(data) {
            console.log(data)
        }
    }
}
</script>
<template>
    <button class="btn-lg-imp" @click='getSend'>获取收货参照</button>
    <send :config='sendCfg' @cb='getItem'></send>
</template>
<style lang='less'>
</style>
