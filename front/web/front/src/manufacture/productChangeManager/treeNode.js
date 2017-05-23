/**
 * Created by yj on 17/4/26.
 */
import Vue from 'vue'
export default Vue.extend({
    template: 
    '<ul class="table-ul" v-if="material.length>0">' +
    '   <li class="head">' +
    '       <div class="wd1">' +
    '          <p class="process-name">{{material[0].processName}}</p>' +
    '      </div>' +
    '      <div class="wd1" style="width:20%">' +
    '          <span>生产班组:{{material[0].departmentName}}</span>' +
    '      </div>' +
    '      <div class="wd1" style="width:20%">' +
    '          <span>生产负责人:{{material[0].employeeName}}</span>' +
    '      </div>' +
    '      <div class="wd1" style="width:20%">' +
    '          <span>生产数量:{{material[0].quantity}}</span>' +
    '      </div>' +
    '      <div class="wd1" style="width:20%">' +
    '          <span v-if="material[0].processSort == 0">已入库:{{material[0].finishQuantity}}</span>' +
    '          <span v-else>已完成:{{material[0].finishQuantity}}</span>' +
    '      </div>' +
    '  </li>' +
    '  <li class="bodyHead">' +
    '      <div class="wd1" style="width:3%" ></div>' +
    '      <div class="wd1">' +
    '          <span>货品信息</span>' +
    '      </div>' +
    '      <div class="wd1" style="width:10%">' +
    '          <span>单位</span>' +
    '      </div>' +
    '      <div class="wd1">' +
    '          <span>单位用量</span>' +
    '      </div>' +
    '      <div class="wd1">' +
    '          <span>订单用量</span>' +
    '      </div>' +
    '      <div class="wd1">' +
    '          <span>损耗率(%)</span>' +
    '      </div>' +
    '      <div class="wd1">' +
    '          <span>生产用量</span>' +
    '      </div>' +
    '      <div class="wd1" style="width:12%">' +
    '          <span>领料数量</span>' +
    '      </div>' +
    '  </li>' +
    '  <li class="bodyCnt" v-show="$index!=0" v-for="item in material">' +
    '      <div class="wd1" style="width:3%" >' +
    '          <i v-show="item.children && !item.open" style="width:12px;" class="icon-select_caret" @click="toggle($index)"></i>' +
    '          <i v-show="item.children && item.open" style="width:12px;" class="icon-select_caret open" @click="toggle($index)"></i>' +
    '          <span>{{$index}}</span>' +
    '      </div>' +
    '      <div class="wd1"  >' +
    '          <div class="itemGroup" style="color:#212121">' +
    '              <label >{{item.inventoryCode}}</label>' +
    '              <label >{{item.inventoryName}}</label>' +
    '          </div>' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.attributeName}}  /  {{item.inventorySpec}}</label>' +
    '          </div>' +
    '      </div>' +
    '      <div class="wd1" style="width:10%">' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.unitName}}</label>' +
    '          </div>' +
    '      </div>' +
    '      <div class="wd1" >' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.quantity}}</label>' +
    '          </div>' +
    '      </div>' +
    '      <div class="wd1" >' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.orderQuantity}}</label>' +
    '          </div>' +
    '      </div>' +
    '      <div class="wd1" >' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.lossRate}}</label>' +
    '          </div>' +
    '      </div>' +
    '      <div class="wd1" >' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.productionQuantity}}</label>' +
    '          </div>' +
    '      </div>' +
    '      <div class="wd1" style="width:12%" >' +
    '          <div class="itemGroup" >' +
    '              <label >{{item.pickQuantity}}</label>' +
    '          </div>' +
    '      </div>' +
    '  <cli v-if="item.children && item.open" :material="item.children" :status="status"></cli>' +
    '  </li>' +
    '</ul>',
    name: 'cli',
    props: ['material', 'status'],
    methods:{
        toggle(index){
            Vue.set(this.material[index],'open',!this.material[index].open)
            // this.material[index].open=true;
            // console.log(index)
        }
    }
})
