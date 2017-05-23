<script>
    import editor from 'nc/editor/app'
    export default {
        components:{
            editor
        },
        data(){
            return {
                editorInitValue:'1231312321',
                content:''
            }
        },
        methods:{
            getContent(val){
                this.content = val
            }
        }
    }
</script>
<template>
    <div class="editor-wrapper">
        <editor  :value="editorInitValue" @input="getContent"></editor>
    </div>
    <div>
        {{content | json}}
    </div>
</template>
<style lang="less">
    .editor-wrapper{
        height: 100%;
        padding: 30px;
        overflow-y: scroll;
    }
</style>

