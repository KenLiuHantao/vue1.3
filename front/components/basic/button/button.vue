<script>
export default{
    props:{
        'time':{
            type:Number,
            default:'3000'
        },
        'disabled':{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            states:false,
            timer:null
        }
    },
    methods:{
        setState(){
            if(!this.states){
                this.states = true
                this.timer = setTimeout(()=>{
                    this.states = false
                    clearTimeout(this.timer)
                },this.time)
            }
        }
    },
}
</script>

<template>
    <button @click="setState" :disabled="states || disabled">
        <slot></slot>
    </button>
</template>

<style lang="less">

</style>