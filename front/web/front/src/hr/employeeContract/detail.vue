<script>
export default {
    props:['type','config','detail'],
    data(){
        return {
            dateCfg:{
                format: 'YYYY-MM-DD',
                clear:false
            },
            uCfg:{
                limit:6,
                maxwidth:400
            },
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            }
        }
    },
    methods:{
        renewalSure(){
            if(this.type==0){
                this.$http.post(__URL.hr + 'employee/contract/renew', this.newDetail).then(
                    (res) => {
                        if(res.data.success){
                            this.config.show=false;
                            this.$emit('cb','续约成功')
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }else if(this.type==1){
                this.$http.post(__URL.hr + 'employee/contract/edit', this.newDetail).then(
                    (res) => {
                        if(res.data.success){
                            this.config.show=false;
                            this.$emit('cb','保存成功')
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
            
        },
        renewalClose(){
            this.config.show=false;
        }
    },
    computed:{
        newDetail(){
            return this.detail
        }
    }
}
</script>
<template>
    <modal :config='config' @sure='renewalSure' @close='renewalClose'>
    <div class="pd-10 filter_body">
        <div class="form-group">
            <label><span class="must-point">*</span>合同类别:</label>
            <div class="s-input ic2">
            <select v-model='newDetail.employeeForm'>
                <option value='0'>劳动合同</option>
                <option value='1'>劳务合同</option>
                <option value='2'>临时合同</option>
                <option value='3'>返聘协议</option>
                <option value='4'>实习协议</option>
            </select>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>合同期限:</label>
            <div class="s-input ic2">
            <select v-model='newDetail.contractPeriod'>
                <option value='0'>6个月</option>
                <option value='1'>12个月</option>
                <option value='2'>24个月</option>
                <option value='3'>36个月</option>
                <option value='4'>无固定期限合同</option>
                <option value='5'>其它</option>
            </select>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>合同开始时间:</label>
            <div class="s-input ic2">
            <date-picker :config='dateCfg'  :date.sync='newDetail.beginDate'></date-picker>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>合同结束时间:</label>
            <div class="s-input ic2">
            <date-picker :config='dateCfg'  :date.sync='newDetail.endDate'></date-picker>
            </div>
        </div>
        <div class="form-group">
            <label><span style='visibility: hidden;' class="must-point">*</span>合同文件:</label>
            <div class="s-input ic2">
            <upfile-group :config ='uCfg' :edit='true' :data="newDetail.files"></upfile-group>
            </div>
        </div>
        <div class="form-group">
            <label><span style='visibility: hidden;' class="must-point">*</span>备注:</label>
            <div class="s-input ic2">
            <textarea type='text' maxlength='120' v-model='newDetail.remark' placeholder='请输入备注信息'>
            </textarea>
            </div>
        </div>
    </div>
     </modal>
     <warning :config="msgconfig" ></warning>
</template>
<style lang="less" scoped>
@import '../../../../../public/css/variable.less';
    .form-group {
        > label {
            width: 110px;
        }
        .s-input {
            width: calc(~"100% - 140px") !important;
        }
    }
</style>

