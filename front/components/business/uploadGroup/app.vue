<script>
   import upfile from 'nc/uploadfile/app'
   export default {
        components:{
            upfile
        },
        props:['config','edit','data'],
        data(){
            return {
                cfg:{
                    limit:6,
                    size: 1024 * 1024 * 10,
                    extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
                    url: __URL.v1+'file/upload',
                    maxWidth:'none'
                },
                extIcon:{
                    'jpg':'icon-jpg',
                    'jpeg':'icon-jpg',
                    'png':'icon-png',
                    'gif':'icon-jpg',
                    'doc':'icon-word',
                    'docx':'icon-word',
                    'xls':'icon-excel',
                    'xlsx':'icon-excel',
                    'ppt':'icon-ppt',
                    'pptx':'icon-ppt',
                    'zip':'icon-zip',
                    'txt':'icon-txt',
                    'pdf':'icon-pdf',
                }
            }
        },
        ready(){
            this.copyCfg()
        },
        methods:{
            getFile(val){
                this.data.push(val)
            },
            del(item){
               let i= this.data.indexOf(item)
               this.data.splice(i,1)
            },
            copyCfg(){
                if (this.config != undefined && this.config != null && this.config) {
                    Object.keys(this.config).forEach((key) => {
                        this.cfg[key] = this.config[key]
                    })
                }
            },
            fileType(val){
                let ext= val.fileName.substr(val.fileName.lastIndexOf(".")+1).toLowerCase();
                let c = ''
                if(this.extIcon[ext] != undefined){
                    c = this.extIcon[ext]
                }else{
                    c = 'icon-other'
                }
                return c
            }
        },
        watch:{
           /* data:{
                handler(val){
                    if(val.length >= this.cfg.limit){
                        this.upfileBtn = false
                    }else{
                        this.upfileBtn = true
                    }
                },
                deep:true
            },*/
            config:{
                handler(val){
                    this.copyCfg()
                },
                deep:true
            }
        },
       computed:{
           upfileBtn(){
               return this.data.length < this.cfg.limit
           }
       }
   }
</script>
<template>
    <div class="up-wrap" v-if="edit" :style='{maxWidth:cfg.maxwidth+"px"}'>
        <div class="show-item edit-border" v-for="item in data">
            <span class="item-icon icon" :class="fileType(item)"></span>
            <span class="item-text" :title="item.fileName">{{item.fileName}}</span>
            <span class="icon icon-modal__close del" @click="del(item)"></span>
        </div>
        <div class="operation">
            <slot v-if="upfileBtn">
                <upfile @cb="getFile" :config="cfg"></upfile>
            </slot>
            <span class="num">{{data.length || 0}}/{{cfg.limit}}</span>
        </div>
    </div>
    <div class="up-wrap" v-else :style='{maxWidth:cfg.maxwidth+"px"}'>
        <div @click="$downFile(item)" class="show-item show-hover" v-for="item in data">
            <span class="item-icon icon" :class="fileType(item)"></span>
            <span class="item-text" :title="item.fileName">{{item.fileName}}</span>
        </div>
    </div>

</template>
<style lang="less" scoped>
    @import '../../../public/css/variable.less';
    .up-wrap{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        .operation{
            display: flex;
            height: 28px;
            align-items: flex-end;
            margin: 5px 0;
        }

        .num{
            margin-left: 5px;
            color: #9B9B9B;
        }
    }
    .show-item{
        display: flex;
        height:28px;
        align-items: center;
        padding-left: 8px;
        font-size: 0;
        color: @gray-sub;
        margin: 5px 10px 5px 0;
        max-width: 100%;
        &.edit-border{
            border: 1px solid #F4F4F4;
            border-radius: 2px;

            .item-text{
                width: 120px;
                line-height: 1.5;
            }
        }
        &.show-hover{
            cursor: pointer;
        }
        span{
            font-size: 12px;
        }
        .item-icon{
            font-size: 16px;
            display: inline-block;
            width: 18px;
            height: 20px;
            background-size: 100% 100%;
            background-position: center center;
        }
        .item-text{
            display: inline-block;
            line-height: 1.5;
            margin-right: 6px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .del{
            cursor: pointer;
            &:hover{
                color: @link-hover;
            }
        }
    }


</style>

