<script>
    import pagination from 'nc/nav/pagination.vue'
    export default {
        components:{
            pagination
        },
        data(){
            return {
                total:221,
                pageCfg:{
                  'pageSize': 50,
                  'pageIndexName': 'pageIndex',
                  'pageSizeName': 'pageSize',
                  'jump':true
                },
                item:{}
            }
        },
        methods:{
            showCb(item){
              console.log(item)
              this.item=item
            }
        }
    }
</script>
<template>
    <pre>
    total 必填,取res里面的totalCount
    config参数:

    {
        每页的数量，和cfg里面保持一致
        'pageSize': 50,

        默认的属性名 
        'pageIndexName': 'pageIndex',
        'pageSizeName': 'pageSize',

        是非显示可输的页面跳转
        'jump':true

     }
     methods :
     @cb  返回当前pageIndex和pageSize的值,请根据值重新请求
     {{ item | json}}
    </pre>
    <pagination :total='total' :config='pageCfg' @cb='showCb'></pagination>
    
</template>
<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
        overflow: auto;
    }
</style>

