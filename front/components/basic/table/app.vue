<script type="text/javascript">
	import Vue from 'vue'
	import inp from 'nc/input/app'
	import cfg from './operating/cfg.js'

	/* baseComponents */
	import inputOption from './baseComponents/inputOptionGroup.js'
	import initInput from './baseComponents/inputGroup.js'

	cfg.forEach((item) => {
		Vue.component(item.temp, require('./operating/' + item.name))
	})

	import status from './statusControl/app'

	/*
	 * @Author:fov
	 * @功能点:
	 * 1.普通表格展示作用
	 * 2.编辑表格展示
	 * 3.编辑含复选框表格展示
	 * @可操作功能块含以下几种状态
	 * ——编辑状态 => input和p标签的互换
	 * ——删除功能 => 单行删除整体数据
	 * ——查看功能 =>
	 * ——总计功能
	 */

	/*
	 * @config:Object
	 *  checkbox:true,    //多选状态，默认为false
	 *  radio:true,    //单选状态，默认为false
	 *  serial:true,    //是否需要序号排列，默认为false
	 *  edit:true,      //是否处于编辑状态，默认为false
	 *  operating:true,      //操作栏的拓展件，默认为false
	 *  review:true,      //当行的变色展示，默认为false
	 *  total:[true,Array(key,key)],     //是否需要合计功能，默认为false
	 *  totalShow:[true,Array({key:'name',value:'val'})],     //是否需要合计功能，默认为false
	 * @match:Array
	 * 该数组为一一对应数据字段key值，根据数组字段加载数据
	 * 里面可包含参数有
	 * ——href => Boolean，超链接，对应方法为{}
	 * ——input => Object，只能存在于编辑状态
	 * ——edit => Boolean，是否为编辑按钮{}
	 * ——type => Number，1-4对应为增删改查
	 * ——disabled => Boolean，是否为disabled
	 */

	export default {
		components: {
			inp,
			'input-option': inputOption,
			'init-input': initInput,
			status
		},
		props: {
			config: Object,
			data: Array,
			checkbox: Array,
			radio: Object
		},
		data() {
			return {
				all: false,
				boxObj: [],
				radioId: '', //单选框数据暂存对象
				totalDecimal: 0,
				default: '',
				itemIndex: -1,
				headHeight: ''
			}
		},
		watch: {
			checkbox: {
				deep: true,
				handler(val, old) {
					this.boxObj = this.getBoxObj()
				}
			}
		},
		ready() {
			document.addEventListener('click', () => {
				this.itemIndex = -1
			})

			this.headHeight = document.querySelector('.overflow_head').offsetHeight	// offsetHeight = clientHeight + border

			if (this.checkboxOption && this.checkbox && this.checkbox.length) {
				this.boxObj = this.getBoxObj()
			}

			// 判断是否有radio传入进来
			if (this.radio && this.radio[this.gotRadioKey]) {
				this.radioId = this.getInnerRadio
			}
		},
		methods: {
			deleteItem(ind, item) {
				let uid = ''
				// 判断不同场景类
				if (this.checkboxOption) {
					uid = item[this.gotBoxKey]
					if (this.boxObj.indexOf(uid) != -1) {
						this.checkbox.splice(this.boxObj.indexOf(uid), 1)
						this.boxObj.splice(this.boxObj.indexOf(uid), 1)
					}
				}

				if (this.radioOption) {
					uid = item[this.gotRadioKey]
					if (this.radio[this.gotRadioKey] == uid) this.radio = {}
				}

				this.data.splice(ind, 1)
			},
			checkboxChangeAble: function (val) {
				var canChange;
				if (this.config.checkboxChangeable && (typeof this.config.checkboxChangeable == "function")) {
					canChange = this.config.checkboxChangeable(val);
				} else {
					canChange = true;//默认可以勾
				}
				return canChange;
			},
			checkAll() {
				this.all = !this.all;
				var _ = this;
				if (this.all) {
					this.data.forEach((item) => {
						if (this.boxObj.indexOf(item[this.gotBoxKey]) == -1 && _.checkboxChangeAble(item)) {
							this.checkbox.push(item);
							this.boxObj.push(item[this.gotBoxKey]);
						}
					})
				} else {
					this.data.forEach((item, index) => {
						if (_.checkboxChangeAble(item)) {
							let ind = this.boxObj.indexOf(item[this.gotBoxKey])
							if (ind != -1) {
								this.checkbox.splice(ind, 1);
								this.boxObj.splice(ind, 1);
							}
						}
					})
				}
			},
			getBoxObj() {
				let newArr = [];
				this.checkbox.forEach((item) => {
					newArr.push(item[this.gotBoxKey]);
				})
				return newArr;
			},
			getBoxItem(item) {
				if (this.boxObj.indexOf(item[this.gotBoxKey]) != -1) {
					this.checkbox.splice(this.boxObj.indexOf(item[this.gotBoxKey]), 1)
					this.boxObj.splice(this.boxObj.indexOf(item[this.gotBoxKey]), 1)
				} else {
					this.boxObj.push(item[this.gotBoxKey])
					this.checkbox.push(item)
				}
			},
			getRadioItem(item) {
				this.radio = {}
				this.radio = item
				this.radioId = item[this.gotRadioKey]
			},
			// link
			href(item, key) {
				this.$emit('link', item, key)
			},
			// 对外公开的搜索方法
			itemInfo(params, index) {
				event.stopImmediatePropagation();
				this.$emit('search', params, index)
			},
			// 获取select自定义相对应的key的值
			getSelfBoxCode(obj, key) {
				let code = {}
				obj.custom.keyCode.filter((item) => {
					if (item[obj.key] == key) {
						code = item
					}
				})
				return code
			},
			// 右侧栏操作
			operatingItem(type, item) {
				this.$emit('op', type, item)
			},
			edit(item) {
				this.$emit('edit', item)
			},
			del(item) {
				this.$emit('del', item)
			},
			enable(item) {
				this.$emit('enable', item)
			},
			rightedit(item) {
				this.$emit('edit', item)
			},
			rightdel(item) {
				this.$emit('del', item)
			},
			getDecimal(key) {
				this.$http.post(__URL.arc + 'parameter/digital/all', {}).then(
						(res) => {
							res.data.data.forEach((item) => {
								if (item.code == key) {
									this.totalDecimal = item.decimal
								}
							})
						}
				)
			},
			toDecimal(val) {
				var f = parseFloat(val),
						len = Math.pow(10, this.totalDecimal)
				if (isNaN(f)) {
					return false;
				}
				var f = Math.round(val * len) / len;
				var s = f.toString();
				var rs = s.indexOf('.');
				if (rs < 0) {
					rs = s.length;
					s += '.';
				}
				while (s.length <= rs + 2) {
					s += '0';
				}
				return s;
			},
			// 为解决单号不换行而需要添加class的td索引数组，判断$index是否在数组中的方法
			newlineInclude (index) {
				return this.newlineClass.some((val) => index == val)
			},
            // 首行是否为 text-align: left
            FITAL_func () {
			    return this.FITAL_state
			},
			//getLine(index,item){
			//	this.$emit('line',index,item)
			//}
		},
		computed: {
			// table的基础配置返回列表
			thead() {
				return this.config.head
			},
			theadHight() {
				return [{
					top:document.querySelector('.overflow_head') && document.querySelector('.overflow_head').offsetHeight + 'px'
				}]
			},
			tbody() {
				return this.config.match
			},
			select() {
				return this.config.select ? this.config.select : false
			},
			radioOption() {
				return this.config.radio ? this.config.radio[0] : false
			},
			checkboxOption() {
				return this.config.checkbox ? this.config.checkbox[0] : false
			},
			serial() {
				return this.config.serial ? this.config.serial : false
			},
			operating() {
				return this.config.operating ? this.config.operating[0] : false
			},
			statusControl(){
				return this.config.statusControl ? this.config.statusControl[0] : false
			},
			gotStatusConfig(){
				return this.config.statusControl ? this.config.statusControl[1] : {}
			},
			edit() {
				return this.config.edit ? this.config.edit : false
			},
			review() {
				return this.config.review ? this.config.review[0] : false
			},
			// 总计功能
			total() {
				return this.config.total ? this.config.total[0] : false
			},
			totalShow(){
				return this.config.totalShow ? this.config.totalShow[0] : false
			},
			totalData(){
				return this.config.totalShow ? this.config.totalShow[1] : []
			},
			// 获取单选多选key值
			gotRadioKey() {
				return this.config.radio ? this.config.radio[1] : ''
			},
			gotOperate() {
				return this.config.operating ? this.config.operating[1] : ''
			},
			gotOperateCfg() {
				return this.config.operating ? this.config.operating[2] : {}
			},
			gotBoxKey() {
				return this.config.checkbox ? this.config.checkbox[1] : ''
			},
			gotDeafultKey() {
				return this.config.default ? this.config.default.key : ''
			},
			gotDeafultSubKey() {
				return this.config.default ? this.config.default.subKey : ''
			},
			gotReviewKey() {
				return this.config.review ? this.config.review[1] : ''
			},
			gotReviewCfg() {
				return this.config.review ? this.config.review[2] : []
			},
			// 判断是否是全选
			isAll() {
				let all = true
				if (this.checkboxOption && this.boxObj && this.boxObj.length) {
				    if (!this.data.length) {
				        all = false
					}
					for (let i in this.data) {
						if (this.boxObj.indexOf(this.data[i][this.gotBoxKey]) == -1) {
							all = false
							break
						}
					}
				} else {
					all = false
				}

				this.all = all
				return all
			},
			// 获取传入的{{ 多选 || 单选 }}数据
			getInnerRadio() {
				return this.gotRadioKey ? this.radio[this.gotRadioKey] : ''
			},
			// 为解决单号不换行而需要添加class的td索引数组
            newlineClass () {
			    return this.config.newline ? this.config.newline : []
			},
			// 首行是否为 text-align: left
            FITAL_state () {
                return this.config.firstItemTextAlignLeft ? this.config.firstItemTextAlignLeft : false
			},
		},
		filters: {
			// 需要通过计算的值，根据match里面进行匹配出数据
			caculation: {
				write(val, oldval, opt, ind) {
					let _ = this,
							newCode = '',
							dataBody = _.data[ind],
							param = {
								entCode: '',
								params: {
									code: opt.calculation.code,
									ident: opt.calculation.ident,
									v1: dataBody[opt.calculation.v1],
									v2: dataBody[opt.calculation.v2]
								},
								userCode: ''
							},
							item = dataBody[opt.key];

					if (!/^-?\d+\.?\d{0,2}$/.test(val)) {
						newCode = val.substring(0, val.indexOf('.') + 3)
					} else {
						newCode = val
					}

					if (val.length != oldval.length) {
						newCode = val
					} else {
						newCode = oldval
					}

					if ((dataBody[opt.calculation.v2] != '' || dataBody[opt.calculation.v2] != 0) && dataBody.byUnitName != '') {
						param.params.v1 = newCode;
						this.$http.post(opt.calculation.ajax, param).then(
								(res) => {
									dataBody[opt.calculation.code] = res.data.data
								}
						)
					}
					return newCode
				}
			},
			// 非获取数据的select回类
			select: {
				twoWay: true,
				write(val, oldval, model, index) {
					let keyObj = this.getSelfBoxCode(model, val)
					for (let i in keyObj) {
						this.data[index][i] = keyObj[i]
					}
					return val
				}
			},
			// 用于展示下拉框多个展示数据拼接
			showCode(val, model) {
				let newCode = '';
				model.showCode.filter((item) => {
					newCode += val[item]
				})
				return newCode
			},
			// 用于计算后续默认值
			default: {
				twoWay: true,
				write(val, oldval) {
					this.data.filter((item) => {
						item[this.config.default.subKey] = 0
					})
					this.data[val][this.config.default.subKey] = 1
					return val
				}
			},
			// 算总计
			totalCount(val, ind) {
				let group = this.config.total[1],
						to = 0
				this.data.forEach((item, index) => {
					to += Number(item[val])
				})

				return isNaN(to) ? this.toDecimal(0) : this.toDecimal(to)
			},
			// 状态类名计算
			status(val, filt) {
				let arr = [{
					base: false
				}, {
					disabled: false
				}, {
					danger: false
				}, {
					success: false
				}]
				if (val.default.indexOf(filt) != -1) {
					arr[0].base = true
				}

				if (val.disabled.indexOf(filt) != -1) {
					arr[0].disabled = true
				}

				if (val.danger.indexOf(filt) != -1) {
					arr[0].danger = true
				}

				if (val.success.indexOf(filt) != -1) {
					arr[0].success = true
				}
				return arr
			},
			objecFilter(val, type) {
				let isTrue = false;
				if (typeof val == 'object') {
					if (val.length && type == 'arr') {
						isTrue = true
					} else if (type == "obj") {
						isTrue = true
					} else {
						isTrue = false
					}
				}
				return isTrue
			},
			reviewClass(val) {
				let arr = []
				if (this.review) {
					this.gotReviewCfg.forEach((item) => {
						if (val[this.gotReviewKey] == item.val) {
							arr = item.style
						}
					})
				}
				return arr
			},
			reviewIcon(val) {
				let arr = []
				if (this.review) {
					this.gotReviewCfg.forEach((item) => {
						if (val[this.gotReviewKey] == item.val) {
							arr.push(item.icon)
						}
					})
				}
				return arr
			},
			reviewImg(val) {
				let arr = ''
				if (this.review) {
					this.gotReviewCfg.forEach((item) => {
						if (val[this.gotReviewKey] == item.val) {
							arr = item.img
						}
					})
				}
				return arr;
			},
			checkboxChangeAbleFilter(val){
				return !this.checkboxChangeAble(val);
			}
		}
	}
</script>
<template>
	<div class="overflow_head">
		<table class="table-list">
			<thead>
			<tr class="fc-pl" :class="{ 'left': FITAL_func() }">
				<th width="5%" v-if='checkboxOption'>
					<input @click='checkAll' :checked="isAll" type="checkbox">
				</th>
				<th v-if='radioOption' width="5%"></th>
				<th v-if='serial' width="10%">序号</th>
				<th v-for='th in thead' track-by="$index" :width="config.width[$index]*5+'%'">
					<template v-if='typeof th == "function"'>{{{th()}}}</template>
					<template v-else>{{th}}</template>
				</th>
				<th v-if='statusControl' width='10%' >{{gotStatusConfig.title}}</th>
				<th v-if='operating || warehouseOperate || configOperate' width="12%" class="txtcenter">操作</th>
			</tr>
			</thead>
		</table>
	</div>
	<div class="overflow" :style='theadHight'>
		<table class="table-list" :class="{'rbac':config.class=='rbac'}">
			<tbody>
			<tr v-for='(index,item) in data' :style='item | reviewClass'
				class="fc-pl" :class="{ 'left': FITAL_func() }">
				<!-- 多选配置 -->
				<td width="5%" v-if='checkboxOption'>
					<input @click='getBoxItem(item)' v-model='boxObj' :disabled="item | checkboxChangeAbleFilter" :value='item[gotBoxKey]' type="checkbox">
				</td>
				<!-- 单选配置 -->
				<td width="5%" v-if='radioOption'>
					<input @click='getRadioItem(item)' :value='item[gotRadioKey]' v-model='radioId' type="radio">
				</td>
				<!-- 排序配置 -->
				<td width="10%" v-if='serial' class="serial">
					{{index+1}}
					<!-- 特定icon/img配置 -->
					<template v-if='review'>
						<i :class='item | reviewIcon'></i>
						<img :src="item | reviewImg">
					</template>
				</td>
				<!-- 常规配置 -->
				<td v-for='tb in tbody' :class="{ 'newline': newlineInclude($index) }" :width="config.width[$index]*5+'%'">
					<!-- 非编辑状态 -->
					<template v-if='!edit'>
						<template v-if='tb | objecFilter "obj"'>
							<template v-if='tb.href'>
								<template v-if="!tb.func">
									<a @click='href(item,tb.key,true)' href="javascript:;" v-if="item[tb.key] !== undefined" :style='item | reviewClass'>{{item[tb.key]}}</a>
									<a @click='href(item,tb.key,false)' href="javascript:;" v-if="item[tb.key] === undefined" :style='item | reviewClass'>{{tb.key}}</a>
								</template>
								<template v-if="tb.func">
									<a @click='href(item,tb.key,false)' href="javascript:;" :style='item | reviewClass'>{{{tb.func(item)}}}</a>
								</template>
							</template>
							<template v-if='tb.status'>
								<p :class='tb.status | status item[tb.key]'>{{item[tb.key]}}</p>
							</template>
							<template v-if='!tb.status && !tb.href'>
								<p>{{item[tb.key]}}</p>
							</template>
						</template>
						<template v-if='tb | objecFilter "arr"'>
							<template v-for='fo in tb' track-by="$index">
								<a @click='href(item,fo.key)' href="javascript:;" v-if='typeof fo == "object" && fo.href'>{{item[fo.key]}}</a>
								<p class="line" v-if='typeof fo == "object" && (fo.prefix || fo.suffix)'>{{ fo.prefix?fo.prefix:'' }}{{item[fo.key]}}{{fo.suffix?fo.suffix:''}}</p>
								<p class="line" v-else>{{item[fo]}}</p>
							</template>
						</template>
						<template v-if='typeof tb == "function"'>
							{{{tb(item)}}}
						</template>
						<template v-else>
							<p v-if="typeof tb=='function'">{{tb(item)}}</p>
							<p v-else>{{item[tb]}}</p>
						</template>
					</template>
					<!-- 编辑状态 -->
					<template v-else>
						<!-- match为对象，即有配置 -->
						<template v-if='tb | objecFilter "obj"'>
							<!-- 为超链接状态 -->
							<template v-if='tb.href'>
								<a @click='href(item,tb.key)' href="javascript:;">{{item[tb.key]}}</a>
							</template>
							<!-- input状态 -->
							<template v-if='tb.input'>
								<template v-if='tb.inputGroup || tb.calculation || tb.limit'>
									<!-- 有多交互 -->
									<input-option :conf='tb' :item.sync='item'></input-option>
								</template>
								<template v-else>
									<init-input :conf='tb' :item.sync='item'></init-input>
								</template>
							</template>
							<!-- select状态 -->
							<template v-if='tb.select'>
								<select v-if='tb.custom && tb.custom.keyCode' v-model='item[tb.key] | select tb index' :style='{"width":tb.width?tb.width:""}'>
									<option v-for='op in tb.custom.keyCode' :value='op[tb.key]'>
										{{op | showCode tb.custom}}
									</option>
								</select>
								<select v-else v-show='item[tb.selectGroup.keyList].length' v-model='item[tb.key]' :style='{"width":tb.width?tb.width:""}'>
									<option v-for='op in item[tb.selectGroup.keyList]' :value='op[tb.key]'>
										{{op | showCode tb.selectGroup}}
									</option>
								</select>
							</template>
						</template>
						<template v-if='tb | objecFilter "arr"'>
							<template v-for='fo in tb' track-by="$index">
								<a href="javascript:;" v-if='typeof fo == "object"'>{{item[fo.key]}}</a>
								<p class="line" v-else>{{item[fo]}}</p>
							</template>
						</template>
						<template v-if='typeof tb == "function"'>
							{{{tb(item)}}}
						</template>
						<template v-else>
							<p>{{item[tb]}}</p>
						</template>
					</template>
				</td>
				<td v-if='statusControl' width='10%' >
					<status :tabledata='item' :config='gotStatusConfig'></status>
				</td>
				<td v-if='operating' width="12%" class="txtcenter left-line">
					<component :is='gotOperate' @cb='operatingItem' :index='index' :current.sync='itemIndex' :data='item' :config='gotOperateCfg'></component>
				</td>
			</tr>
			<tr class="total" v-if='total && data.length'>
				<td v-if='serial'>总计&emsp;<span>{{data.length}}</span></td>
				<!-- 多选框选择 -->
				<td v-if='checkboxOption'><span v-if='!serial'>总计</span></td>
				<!-- 单选框选择 -->
				<td v-if='radioOption'><span v-if='!serial && !checkboxOption'>总计</span></td>
				<td v-for='item in config.match'>
					<span class="nub" v-if='config.total[1].indexOf(item) != -1'>{{item | totalCount}}</span>
				</td>
			</tr>
			<tr class='total' v-if='totalShow && data.length'>
				<td v-if='serial'>总计&emsp;<span>{{data.length}}</span></td>
				<!-- 多选框选择 -->
				<td v-if='checkboxOption'><span v-if='!serial'>总计</span></td>
				<!-- 单选框选择 -->
				<td v-if='radioOption'><span v-if='!serial && !checkboxOption'>总计</span></td>
				<td v-for='item in config.match'>
					<template v-if='item | objecFilter "arr"'>
						<span class="nub" v-for='data in totalData' v-show='data.key==item[0].key'>{{{data.value}}}</span>
					</template>
					<template v-else>
						<span class="nub" v-for='data in totalData' v-show='data.key==item'>{{{data.value}}}</span>
					</template>
				</td>
			</tr>	
			</tbody>
		</table>
	</div>
</template>
<style lang='less' scoped>
	@import '../../../public/css/variable.less';

	.table-box {
		padding: 10px 0 0 10px;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.overflow {
		position: absolute;
		width: 100%;
		top: 51px;
		bottom: 0;
		overflow: auto;
		overflow-x: hidden;
	}

	/*.modal-content {
		.overflow {
			bottom: 60px;
		}
	}*/

	.overflow_head {
		background-color: @body-bg;
		border-bottom: 1px solid @border-color;
		position: absolute;
		width: 100%;
		top: 0;
	}

	.table-list {
		font-size: @font-size-base;
		width: 100%;
		table-layout: fixed;

		input[type=checkbox], input[type=radio]{
			background: white;
		}

		thead tr th,
		tbody tr td {
			text-overflow: ellipsis;
			white-space: nowrap;
			/*overflow: hidden;*/
			padding: 5px 7px;
			text-align: left;
			&.txtcenter {
				text-align: center;
			}
			&.left-line{
				border-left: 1px solid @border-color;
			}
			p,
			a {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				word-break: break-all;
			}
			a {
				color: @link-color;
			}
			p {
				// 修复含有字母 g 时显示不完全
				line-height: 1.3;
				&.line {
					line-height: 1.2;
					/*margin:4px 0*/
				}
				&.base {
					color: @gray;
				}
				&.disabled {
					color: @gray-sub;
				}
				&.danger {
					color: @danger;
				}
				&.success {
					color: #61BA5B;
				}
			}
		}
		thead tr {
			color: #666;
			th {
				padding: 18px 7px;
				position: relative;
				font-weight: normal;
				color: @gray-sub;
				.must {
					display: inline-block;
					position: absolute;
					font-size: @font-size-small;
					height: 40px;
					line-height: 40px;
					left: 3px;
					top: 0;
					color: @danger;
				}
				&.rightGroup {
					min-width: 80px;
				}
			}
		}
		tbody tr {
			&:nth-of-type(2n-1) {
				background-color: #FAFAFA;
			}
			&:hover {
				background-color: #EBF7FD;
				.icon {
					display: table-cell;
					align-items: center;
				}
			}
			&.total {
				background: #fafafa;
				.nub {
					color: @gray;
				}
			}
			td {
				position: relative;
				border-bottom: 1px solid @border-color;
				font-size: 12px;
				line-height: 1.2;
				padding: 14px 7px;
				.mgr-10 {
					margin-right: 10px;
				}
				textarea,
				select,
				p,
				input[type='text'] {
					width: 100%;
				}
				.more {
					font-size: 20px;
					color: @gray-sub;
					line-height: 12px;
				}
				&.serial {
					i,
					img {
						width: 14px;
						height: 14px;
						font-size: 14px;
						vertical-align: middle;
					}
					i {
						margin-left: 20px;
					}
					img {
						margin-left: 10px;
					}
				}
				.mgl-50 {
					margin-left: 50px;
					margin-right: 10px !important;
				}
				.icon {
					text-align: right;
					display: none;
					width: 100%;
					min-width: 80px;
					.choice {
						margin-right: 20px;
					}
					span {
						display: inline-block;
						width: 28px;
						height: 28px;
						text-align: center;
						line-height: 28px;
						border-radius: 2px;
						vertical-align: middle;
					}
					.add {
						color: #039af4;
						&:hover {
							background-color: @btn-def-bg;
						}
					}
					.del {
						color: @danger;
						&:hover {
							background-color: @btn-def-bg;
						}
					}
					.edit-icon {
						display: none;
						margin-left: 10px;
						span {
							margin-right: 20px;
						}
					}
				}
			}
		}
		.fc-pl {
			> th:first-of-type,
			> td:first-of-type {
				text-align: center;
			}
			&.left {
				> th:first-of-type,
				> td:first-of-type {
					padding-left: 15px;
					text-align: left;
				}
			}

			> th:first-of-type {
				line-height: 15px;
			}
		}
	}

	/*.table-list a:not([class^="btn-"]){
					color:#008af5!important
				}*/

	.table-list thead tr th .must-point {
		display: inline;
		padding-left: 0;
		margin-left: -10px;
		padding-right: 5px;
		vertical-align: middle;
	}
	.rbac tbody tr td {
		white-space: normal !important;
	}

	.newline {
		text-overflow: ellipsis !important;
		white-space: normal !important;
		> * {
			overflow: initial !important;
			text-overflow: initial !important;
			white-space: initial !important;
		}
	}

</style>
