<script>
import noImg from 'np/images/default.png'
import noImg2 from 'np/images/default2.svg'

export default {
    props:['item'],
    data(){
        return {
             // 默认图片的 icon 替换
             noImg:noImg,
             //noImg:noImg2,
             flowCfg:{
                data:[{
                no:'1',
                name:'下单',
//                time:'2016.10.12 22:12:22',
                filed:'制单人',
                user:'smith',
                flag:true,
                },{
                no:'2',
                name:'备货',
//                time:'2017.11.11 09:02:23',
                filed:'审核人',
                user:'skye',
                flag:false,
                },{
                    no:'3',
                    name:'发货',
//                time:'2017.11.11 09:02:23',
                    filed:'审核人',
                    user:'skye',
                    flag:false,
                },{
                    no:'4',
                    name:'出库',
//                time:'2017.11.11 09:02:23',
                    filed:'审核人',
                    user:'skye',
                    flag:false,
                },{
                    no:'5',
                    name:'结束',
//                time:'2017.11.11 09:02:23',
                    filed:'审核人',
                    user:'skye',
                    flag:false,
                }]
            },
            infoModal:{
                "beforeVo":"",
                "mainVo" : {
                  "docNo" : "",
                  "recordId" : "",
                  "customerName" : "",
                  "employeeName" : "",
                  "docDate" : "",
                  "inventoryCode" : "",
                  "inventoryName" : "",
                  "inventorySpec" : "",
                  "deliveryDate" : "",
                  "quantity" : 0,
                  "totalOutboundQty" : 0,
                  "totalUnOutboundQty" : 0
                },
                "afterVo":""
            },
            remarkList:'',
            alertCfg:{
                show:false,
                header:'跟单备注',
                width:'440px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确定',
                    emit:'sure'
                }]
            },
            remarkContent:''
        }
    },
    ready(){
        if(this.item){
            this.getInfo(this.item)
            this.getRemarkList(this.item)
        }
    },
    methods:{
        getInfo(item){
            let param = {
                  "docNo": item.docNo,
                  "recordId": item.recordId
                }
            this.$http.post(__URL.sale + 'salesOrder/findDocumentaryInfo',param).then(
                res=>{
                    if(res.data.success){
                        this.infoModal = res.data.data;
                    }
                }
            )
        },
        getRemarkList(item){
            let param ={
                  "docNo": item.docNo,
                  "docRecordId":item.recordId,
                  "pageIndex": 0,
                  "pageSize": 0
                }
            this.$http.post(__URL.doc+'sale/findList',param).then(
                res=>{
                    if(res.data.success){
                        this.remarkList = res.data.data.dataList
                    }
                }
            )
        },
        addRemark(){
            this.alertCfg.show = true
        },
        addRemarkData(){
            if(this.remarkContent.trim() == '') return
            let param = {
                  "attachments":'',
                  "content":  this.remarkContent,
                  "docRecordId": this.item.recordId,
                  "docNo": this.item.docNo,
                }
            this.$http.post(__URL.doc+'sale/addRemark',param).then(
                res=>{
                    if(res.data.success){
                        this.remarkContent = ''
                        this.alertCfg.show = false
                        this.getRemarkList(this.item)
                    }
                }
            )
        },
        giveUp(){
            this.remarkContent = ''
            this.alertCfg.show =false
        }
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <div class="inner-item-wraper">
                <div class="inner-header">
                    <div class="header-item title">
                        <i></i>
                        <span>销售订单</span><span>{{ infoModal.mainVo.docNo }}</span>
                    </div>
                    <div class="header-item position">
                        <i class="icon icon-customer c"></i>
                        <span>客户:{{infoModal.mainVo.customerName}}</span>
                    </div>
                    <div class="header-item">
                        <i class="icon icon-staff__manage e"></i>
                        <span>业务员:{{infoModal.mainVo.employeeName}}</span>
                    </div>
                    <div class="header-item">
                        <i class="icon icon-time d"></i>
                        <span>下单时间:{{infoModal.mainVo.docDate}}</span>
                    </div>
                </div>
                <div class="inner-contents">
                    <div class="content-item row-info">
                        <img class="img" :src="noImg">
                        <div class="column-info title">
                            <span>{{infoModal.mainVo.inventoryCode}}</span>
                            <span>{{infoModal.mainVo.inventoryName}}</span>
                            <span>{{infoModal.mainVo.inventorySpec}}</span>
                        </div>
                    </div>
                    <div class="content-item content-center">
                            <span>交期日期:</span>{{infoModal.mainVo.deliveryDate}}
                    </div>
                    <div class="content-item column-info w-200">
                        <p><span>销售数量:</span>{{infoModal.mainVo.quantity}}</p>
                        <p><span>已出数量:</span>{{infoModal.mainVo.totalOutboundQty}}</p>
                        <p><span>未出数量:</span>{{infoModal.mainVo.totalUnOutboundQty}}</p>
                    </div>
                    <div class="content-item column-info w-200">
                        <p><span>即时库存:</span>{{infoModal.mainVo.stockQuantity}}</p>
                        <p><span>可用库存:</span>{{infoModal.mainVo.abledStockQty}}</p>
                    </div>
                </div>
            </div>
            <div class="inner-item-wraper">
                <div class="inner-header">
                    <div class="header-item title">
                        <i></i>
                        <span>跟单备注</span>
                    </div>
                </div>
                <div class="inner-contents remark-wrap">
                    <div class="remark-item">
                        <div>跟单详情</div>
                        <div>备注人</div>
                        <div>备注时间</div>
                    </div>
                    <div class="remark-content-wrap">
                        <ul class="remark-content">
                            <li class="remark-item" v-for="item in remarkList">
                                <div :class="{'new':$index==0,'dot':$index != 0}">{{item.content}}</div>
                                <div>{{item.createUser}}</div>
                                <div>{{item.createTime}}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="group-b">
                        <button class="btn-lg-def" @click="addRemark"> <i class="icon-product__add"></i> 添加备注</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="inner-footer" v-if="infoModal.beforeVo != '' && infoModal.afterVo != ''">
        <div class="page-list">
            <div class="item">
                <slot v-if="infoModal.beforeVo != ''">
                    <div class="list-item opt">
                        <div class="thumb"> <i class="icon-arrow__left"></i> </div>
                        <div>上一页</div>
                    </div>
                    <div class="show-item">
                        <div class="show-img">
                            <img :src="noImg" class="img">
                        </div>
                        <div class="show-info">
                            <p>{{infoModal.beforeVo.inventoryCode}}</p>
                            <p>{{infoModal.beforeVo.inventoryName}}</p>
                            <p>{{infoModal.beforeVo.inventorySpec}}</p>
                        </div>
                    </div>
                </slot>
            </div>
            <div class="item">
                <slot v-if="infoModal.afterVo != ''">
                    <div class="show-item">
                        <div class="show-img">
                            <img :src="noImg" class="img">
                        </div>
                        <div class="show-info">
                            <p>{{infoModal.afterVo.inventoryCode}}</p>
                            <p>{{infoModal.afterVo.inventoryName}}</p>
                            <p>{{infoModal.afterVo.inventorySpec}}</p>
                        </div>
                    </div>
                    <div class="list-item opt ">
                        <div class="thumb"><i class="icon-arrow__right"></i></div>
                        <div>下一页</div>
                    </div>
                </slot>
            </div>
        </div>
    </div>
    <modal :config="alertCfg" @sure="addRemarkData" @quite="giveUp">
        <div class="remark-wrap">
            <textarea class="alert-area" v-model="remarkContent" placeholder="请输入跟单备注"></textarea>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .img{
        width: 70px;
        height: 70px;
        margin-right: 10px;
    }
    .inner-footer{
        height: 100px;
        padding: 0 258px;
        background-color: white;

        .page-list{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .item{
                display: flex;
                flex-direction: row;
            }

            .list-item{
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                margin:0 20px;
            }
            .show-item{
                width: 260px;
                padding: 15px;
                display: flex;
                background-color: #F7F7F7;
                border: 1px solid @border-color;
                align-items: center;

                .show-img{
                    width: 40px;
                    height: 50px;
                    margin-right: 33px;
                    background-color: @gray-sub;
                }
            }
            .opt{
                width: 40px;
                font-size: 12px;
                cursor: pointer;

                .thumb{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #F0F9FF;
                    border: 1px solid #D2EDFF;
                    margin-bottom: 5px;
                    color: #8BCBF5;

                    i{
                        margin-right: 0;
                    }
                }
            }
        }
    }

    .inner-item-wraper{
        margin-bottom: 16px;

        .inner-header{
            height: 46px;
            padding: 0 17px;
            border-bottom: 1px solid @border-color;
            display: flex;
            align-items: center;
            flex-direction: row;
            background:rgba(245,245,245,1);

            .header-item{
                display: flex;
                flex: 1;
                align-items: center;

                .c{
                    color: #FF4E4E;
                }

                .e{
                    color: #03A9F4;
                }

                .d{
                    color: #FF8B35;
                }

                &.title{
                    i{
                        display: inline-block;
                        width: 4px;
                        height: 18px;
                        border-radius: 2px;
                        background-color: black;
                        margin-right: 10px;
                    }
                }
            }
        }
        .inner-contents{
            height: 110px;
            padding: 17px;
            display: flex;
            flex-direction: row;
            align-items: center;

            .content-item{
                display: flex;
                width: 200px;
                flex-shrink: 0;
                font-size: 12px;

                .title span{
                    color: #03A9F4;
                    margin: 5px 0;
                }
            }
            .content-center{
                flex: 1;
                justify-content: center;
            }

            .row-info{
                display: flex;
                flex-direction: row;
            }

            .column-info{
                display: flex;
                flex-direction: column;

                p{
                    margin: 5px 0;
                }
            }
            span{
                color: @gray-sub;
                margin-right: 5px;
            }
        }
        .remark-wrap{
            height: 345px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 12px;
            color: #404040;

            .remark-item{
                display: flex;
                height: 40px;
                flex-shrink: 0;
                width: 100%;
                align-items: center;
                flex-direction: row;
                border: 1px solid @border-color;
                border-bottom: none;

                &:last-child{
                    border-bottom: 1px solid @border-color;
                }

                div{
                    display: flex;
                    line-height: 1.5;
                    position: relative;
                }
                div:nth-of-type(1){
                    flex: 7;
                    padding-left: 50px;
                }
                div:nth-of-type(2){
                    flex: 1;
                }
                div:nth-of-type(3){
                    flex: 2;
                }
                .dot:after{
                    content: '';
                    display: flex;
                    position: absolute;
                    top: 6px;
                    left: 40px;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: black;
                }
                .new:after{
                    content: 'NEW';
                    display: flex;
                    position: absolute;
                    top: 0px;
                    left: 10px;
                    padding: 0 5px;
                    background-color: #FFE3E3;
                    color: red;
                }
            }

            .remark-content-wrap{
                overflow-y: auto;
                border: 1px solid @border-color;
                margin-bottom: 25px;
                width: 100%;

                .remark-content{
                    width: 100%;

                    li{
                        padding: 20px 0;
                        height: auto;
                        align-items: flex-start;
                        border: none;
                        border-bottom: 1px solid @border-color;

                        &:hover{
                            background-color: #fbfbfb;
                        }

                        &:last-of-type{
                            border-bottom: none;
                        }
                    }
                }
            }
        }

        .group-b{
            height: 40px;

            button{
                color: @link-hover;
                border: 1px solid @link-hover;

                &:hover{
                    background-color: white;
                    border: 1px solid @link-hover;
                }
            }
        }

    }
    .remark-wrap{
        padding: 15px;
    }
    .alert-area{
        width: 100%;
        height: 110px;
        font-size: 12px;
    }

    /* 定位 bug 修复 */
    .position {
        position: relative;

        i {
            position: absolute;
        }
        span {
            position: absolute;
            left: 18px;
        }
    }
</style>

