<script>

export default {
    components: {

    },
    props: ['data'],
    data() {
        return {
            warehouseData: []
        }
    },
    ready() {
        this.$http.post(__URL.arc + 'warehouse/find/ref', {}).then((res) => {
            this.warehouseData = res.data.data.dataList;

            if(this.warehouseData.length) {
                this.data.warehouseCode = this.warehouseData[0].warehouseCode;
                this.data.warehouseName = this.warehouseData[0].warehouseName;
            }
        });
    },
    methods: {
        doSelectWarehouse() {
            for(var i = 0; i < this.warehouseData.length; i++) {
                if(this.warehouseData[i].warehouseCode == this.data.warehouseCode) {
                    this.data.warehouseCode = this.warehouseData[i].warehouseCode;
                    this.data.warehouseName = this.warehouseData[i].warehouseName;
                }
            }
        }
    }
}
</script>
<template>
    <div>
        <select v-model="data.warehouseCode" @change="doSelectWarehouse()">
            <option v-for="item in warehouseData" :value="item.warehouseCode">{{item.warehouseName}}</option>
        </select>
    </div>
</template>
