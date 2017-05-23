<script>
    import referPostAuth from 'nb/refer/postAuth'
    export default {
        components:{
            referPostAuth
        },
        data(){
            return{
                funCfg:{
                    show:false
                },
                data:[{
                "version": 0,
                "createDate": "2017-03-22 16:43",
                "updateDate": null,
                "isDeleted": null,
                "code": "64040318",
                "name": "开发主管",
                "entCode": "85562440",
                "remark": null,
                "sort": 90,
                "disableTime": null,
                "disableReason": null,
                "disableBy": null,
                "disableDepartmentCode": null,
                "relatedPostList": [
                    {
                        "id": null,
                        "version": null,
                        "createDate": null,
                        "updateDate": null,
                        "code": "M1031",
                        "name": "开发基础设置",
                        "remark": null,
                        "sort": null,
                        "category": null,
                        "alias": null,
                        "domClass": null,
                        "url": null,
                        "antMatcher": null,
                        "communion": false
                    },
                    {
                        "id": null,
                        "version": null,
                        "createDate": null,
                        "updateDate": null,
                        "code": "M1030",
                        "name": "BOM档案审核管理",
                        "remark": null,
                        "sort": null,
                        "category": null,
                        "alias": null,
                        "domClass": null,
                        "url": null,
                        "antMatcher": null,
                        "communion": false
                    }
                ],
                "users": [
                    {
                        "version": 1,
                        "createDate": "2017-03-22 18:03",
                        "updateDate": null,
                        "isDeleted": 0,
                        "code": "84119463",
                        "name": "高昊",
                        "accountCode": "82023468",
                        "entCode": "85562440",
                        "authState": 0,
                        "isDefault": 0,
                        "admin": 0
                    },
                    {
                        "version": 1,
                        "createDate": "2017-04-05 10:10",
                        "updateDate": null,
                        "isDeleted": 0,
                        "code": "84473426",
                        "name": "小岳岳",
                        "accountCode": "25692753",
                        "entCode": "85562440",
                        "authState": 0,
                        "isDefault": 0,
                        "admin": 0
                    },
                    {
                        "version": 1,
                        "createDate": "2017-03-22 16:43",
                        "updateDate": null,
                        "isDeleted": 0,
                        "code": "14258087",
                        "name": "红衣服同事",
                        "accountCode": "56520012",
                        "entCode": "85562440",
                        "authState": 1,
                        "isDefault": 1,
                        "admin": 1}]
                }],
                checkedData:''
            }
        },
        methods:{
            empower(){
                this.funCfg.show = true
            },
            getData(val){
                this.checkedData = val
            }
        }
    }
</script>
<template>
    <button class="btn-lg-imp" @click="empower">职能授权</button>
    <refer-post-auth :config="funCfg" :data="data" @cb="getData"></refer-post-auth>
    <pre>
    props配置数据：
        config:{
            //参照是否显示  true|false
            show:false
        }

        //传递已选择的职能
        data:[]

    methods方法:

        //点击确定按钮后返回选中的数据
        @cb(val)

    返回数据:
    {{checkedData | json}}
    </pre>
</template>
<style lang="less">
    pre{
        height: 400px;
        overflow: auto;
        margin-top: 30px;
    }
</style>