<script>
	import moment from 'moment';
	var hourList = (function () {
		//一天二十四小时
		var hourList = [];
		for (var i = 0; i <= 23; i++) {
			hourList.push(i);
		}
		return hourList;
	})();
	export default {
		props: {
			date: String,
			config: Object,
			show: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			hasHourSelect: function () {
				//判断是否需要出现小时选择框
				return this.initCfg.format.indexOf("HH") != -1
			}
		},
		data() {
			return {
				//小时列表
				hourList,
				initCfg: {
					placeholder: '请选择时间',
					minDate: null,
					maxDate: null,
					format: 'YYYY-MM-DD', //YYYY/MM/DD
					clear: false
				},
				state: {
					pickerShow: false,
					dayListShow: true,
					monthListShow: false,
					yearListShow: false,
					timeListShow: false
				},
				timeInfo: {
					current: null,
					year: 1972,
					month: 10,
					selectedHour: 0
				},
				daysList: [],
				weekList: ['日', '一', '二', '三', '四', '五', '六'],
				monthCfg: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				monthList: [],
				yearList: [],

				//按钮状态
				btnStatus: {
					preYear: true,
					nextYear: true,
					preMonth: true,
					nextMonth: true
				},
				//选择日期框是在否去顶部
				dateToTop:false
			}
		},
		ready() {
			this.cloneInitCfg();//复制配置中的选项(把写在页面上的选项复制过来)
			const _ = this;
			document.addEventListener('click', () => {
				_.show = false
			})
		},
		watch: {
			//监测config变化,如果改变则再次克隆数据到initCfg中
			config: {
				handler(val, oldval) {
					this.cloneInitCfg()
				},
				deep: true
			},
			timeInfo: {
				handler(val, oldval) {
					//监测timeInfo变化，如果变化则改变切换年月按钮状态
					//判断是否需要有“上一年”“下一年”“上个月”“下个月”的按钮，防止越界
					this.btnStatus.preYear = this.isMinLimitDate('year');
					this.btnStatus.nextYear = this.isMaxLimitDate('year');
					this.btnStatus.preMonth = (this.isMinLimitDate('year') && this.isMinLimitDate('month'));
					this.btnStatus.nextMonth = (this.isMaxLimitDate('year') && this.isMaxLimitDate('month'));
				},
				deep: true
			}
		},
		methods: {
			//clone数据
			cloneInitCfg() {
				if (this.config) {
					Object.keys(this.config).forEach(key => {
						this.initCfg[key] = this.config[key]
					})
					if (this.initCfg.minDate && this.initCfg.maxDate && !moment(this.initCfg.minDate).isBefore(this.initCfg.maxDate)) {
						this.initCfg.minDate = this.initCfg.maxDate;
					}
				}
			},
			//获取上一个月，下一个月的月份
			getCloseMonth(time) {
				return {
					pre: moment(moment(time).add(-1, 'months')),
					next: moment(moment(time).add(1, 'months'))
				}
			},
			//获取某个月份的天数，并且设置是不是当前月
			getDaysList(time, current = false) {
				let dayList = [],
						mCfgMin = moment(Date.parse(this.initCfg.minDate)),
						mCfgMax = moment(Date.parse(this.initCfg.maxDate)),
						y = this.timeInfo.current.get('year'),
						m = this.timeInfo.current.get('month')
				const dayCount = moment(time).daysInMonth()

				for (let i = 1; i < dayCount + 1; i++) {
					let ua = false
					if (this.hasDate(this.initCfg.minDate) && y == mCfgMin.get('year') && m == mCfgMin.get('month') && i < mCfgMin.get('date')) ua = true
					if (this.hasDate(this.initCfg.maxDate) && y == mCfgMax.get('year') && m == mCfgMax.get('month') && i > mCfgMax.get('date')) ua = true
					dayList.push({
						value: i, //渲染的日期值
						selected: false, //当前是否选中
						unavailable: ua, //是否不能选择
						inMonth: current, //是否是在当前月份当中
						time: moment(moment(time).get('year') + '-' + this.addZero(moment(time).get('month') + 1) + '-' + this.addZero(i))
					})
				}

				return dayList
			},
			//设置要展示的天数列表
			generateDyaList(time) {
				const closeMonth = this.getCloseMonth(time),
						currentMonthDayList = this.getDaysList(time, true),
						preMonthDayList = this.getDaysList(closeMonth.pre),
						nextMothDayList = this.getDaysList(closeMonth.next)

				//获取当月第一天是星期几
				let theFirstDayAtWeek = moment(time).date(1).day()
				if (theFirstDayAtWeek == 0) theFirstDayAtWeek = 7;
				for (let i = preMonthDayList.length - 1; preMonthDayList.length - theFirstDayAtWeek <= i; i--) {
					currentMonthDayList.unshift(preMonthDayList[i])
				}

				let listCount = 42 - currentMonthDayList.length
				for (let i = 0; i < listCount; i++) {
					currentMonthDayList.push(nextMothDayList[i])
				}
				return currentMonthDayList
			},
			//设置要展示的月份列表
			generateMonthList(month) {
				let months = [],
						mCfgMin = moment(Date.parse(this.initCfg.minDate)),
						mCfgMax = moment(Date.parse(this.initCfg.maxDate))

				//设置了最小日期，当前年份等于最小值时，月份也要重置
				if (this.hasDate(this.initCfg.minDate) && mCfgMin.get('year') != mCfgMax.get('year') && this.timeInfo.year == mCfgMin.get('year')) {
					month.forEach((item, index) => {
						months.push({
							unavailable: mCfgMin.get('month') > index ? true : false,
							value: item
						})
					})
					return months
				}
				//设置了最大日期，当前年份等于最大值时，月份也要重置
				if (this.hasDate(this.initCfg.maxDate) && mCfgMin.get('year') != mCfgMax.get('year') && this.timeInfo.year == mCfgMax.get('year')) {
					month.forEach((item, index) => {
						months.push({
							unavailable: mCfgMax.get('month') < index ? true : false,
							value: item
						})
					})
					return months
				}
				//设置了最大最小日期，且最大最小为同一年份，月份分为两部分渲染
				if (this.hasDate(this.initCfg.maxDate) && this.hasDate(this.initCfg.minDate) && mCfgMin.get('year') == mCfgMax.get('year') && this.timeInfo.year == mCfgMax.get('year')) {
					month.forEach((item, index) => {
						months.push({
							unavailable: mCfgMax.get('month') < index || mCfgMin.get('month') > index ? true : false,
							value: item
						})
					})
					return months
				}
				//当前年份不等于最大值或最小值时正常渲染
				month.forEach((item, index) => {
					months.push({
						unavailable: false,
						value: item
					})
				})
				return months
			},
			//设置要展示的年份列表
			generateYearList(year) {
				let years = [],
						mCfgMin = moment(Date.parse(this.initCfg.minDate)),
						mCfgMax = moment(Date.parse(this.initCfg.maxDate))

				for (let i = 1; i < 6; i++) {
					years.unshift({
						value: year - i,
						unavailable: this.hasDate(this.initCfg.minDate) && mCfgMin.get('year') > year - i ? true : false
					})
				}
				years.push({
					value: year,
					unavailable: false
				})
				for (let i = 1; i < 7; i++) {
					years.push({
						value: year + i,
						unavailable: this.hasDate(this.initCfg.maxDate) && mCfgMax.get('year') < year + i ? true : false
					})
				}
				return years
			},
			//切换显示日期选择界面
			togglePicker(e) {
				//获取当前元素到浏览器顶部的距离
				this.getAddress(e)
				//触发toggle回调
				this.$emit('toggle')
				//将其余的日期选择框都隐藏
				var lis = Array.prototype.slice.call(document.querySelectorAll('.date-content'))
				if (lis.length > 0) {
					lis.forEach(function (item) {
						item.style.display = 'none';
					});
				}
				this.show = !this.show;
				//初始化所有显示面板
				this.state.dayListShow = true
				this.state.monthListShow = this.state.yearListShow = this.state.timeListShow = false

				//设置当前时间
				var mCurrent = moment(this.date, this.initCfg.format);
				if (mCurrent.format('YYYY-MM-DD') === 'Invalid date') {
					if (this.initCfg.minDate && moment().isBefore(this.initCfg.minDate)) {
						//如果点开弹层的时候日期框框里有日期的话，就要把日期反序列化，好让弹层里对应的日期和小时都选中
						mCurrent = moment(this.initCfg.minDate);
					} else {
						mCurrent = moment();
						mCurrent.set("hour",0);
					}
				}
				this.timeInfo.current = mCurrent;
				this.timeInfo.selectedHour=mCurrent.get("hour");
				this.updateShowList(mCurrent.get('date'))
			},
			//根据当前选中时间，更新显示的日期列表
			updateShowList(sValue) {
				this.daysList = this.generateDyaList(this.timeInfo.current)
				//当日期存在，则返选当前日期
				if (sValue) {
					this.selectValue(this.daysList, sValue)
				}
				//更新显示的年份
				this.timeInfo.year = moment(this.timeInfo.current).get('year')
				this.yearList = this.generateYearList(this.timeInfo.year)
				//更新显示的月份
				this.timeInfo.month = moment(this.timeInfo.current).get('month') + 1
				this.monthList = this.generateMonthList(this.monthCfg)
			},
			//切换年月，到当前选中时间后，当前日期有选中效果
			judgeCurrentDate() {
				let mDate = moment(Date.parse(this.date)),
						current = this.timeInfo.current
				if (current.get('year') == mDate.get('year') && current.get('month') == mDate.get('month')) {
					this.updateShowList(mDate.get('date'))
				} else {
					this.updateShowList()
				}
			},
			//切换年份
			nextYear(next) {
				let mCurrent = moment(this.timeInfo.current),
						mCfgMin = moment(Date.parse(this.initCfg.minDate)),
						mCfgMax = moment(Date.parse(this.initCfg.maxDate))
				if (next) {
					if (!this.isMaxLimitDate('year')) {
						this.timeInfo.current = mCurrent.add(1, 'year')
						if (this.timeInfo.current.get('year') == mCfgMax.get('year') && this.timeInfo.current.get('month') > mCfgMax.get('month')) {
							this.timeInfo.current = mCurrent.set('month', mCfgMax.get('month'))
						}
					}
				} else {
					if (!this.isMinLimitDate('year')) {
						this.timeInfo.current = mCurrent.add(-1, 'year')
						if (this.timeInfo.current.get('year') == mCfgMin.get('year') && this.timeInfo.current.get('month') < mCfgMin.get('month')) {
							this.timeInfo.current = mCurrent.set('month', mCfgMin.get('month'))
						}
					}
				}
				this.judgeCurrentDate()
			},
			//切换月份
			nextMonth(next) {
				let mCfgMin = moment(Date.parse(this.initCfg.minDate)),
						mCfgMax = moment(Date.parse(this.initCfg.maxDate))
				if (next) {
					if (this.hasDate(this.initCfg.maxDate)) {
						if (this.timeInfo.current.get('year') < mCfgMax.get('year')) {
							this.timeInfo.current = moment(this.timeInfo.current).add(1, 'month')
						}
						if (this.timeInfo.current.get('year') == mCfgMax.get('year') && !this.isMaxLimitDate('month')) {
							this.timeInfo.current = moment(this.timeInfo.current).add(1, 'month')
						}
					} else {
						this.timeInfo.current = moment(this.timeInfo.current).add(1, 'month')
					}
				} else {
					if (this.hasDate(this.initCfg.minDate)) {
						if (this.timeInfo.current.get('year') > mCfgMin.get('year')) {
							this.timeInfo.current = moment(this.timeInfo.current).add(-1, 'month')
						}
						if (this.timeInfo.current.get('year') == mCfgMin.get('year') && !this.isMinLimitDate('month')) {
							this.timeInfo.current = moment(this.timeInfo.current).add(-1, 'month')
						}
					} else {
						this.timeInfo.current = moment(this.timeInfo.current).add(-1, 'month')
					}

				}
				this.judgeCurrentDate()
			},
			//选择年份
			chooseYear(year) {
				this.timeInfo.current = moment(this.timeInfo.current).set('year', year)
				this.updateShowList()
				this.toggleView('day')
			},
			//选择月份
			chooseMonth(month) {
				this.timeInfo.current = moment(this.timeInfo.current).set('month', month)
				this.updateShowList()
				this.toggleView('day')
			},
			chooseDay(day) {
				//日期被选中
				if (day.unavailable) return;
				this.clearDaySelected();
				day.selected = true;
				this.timeInfo.current = moment(this.timeInfo.current).set('date', day.value)
				this.date = moment(this.timeInfo.current).format(this.initCfg.format);

				//如果不需要选择小时，选择日期后立即关闭组件
				if (this.hasHourSelect == false) {
					this.show = false;
					this.$emit('cb', this.date)
				}
			},
			timeSelected () {
				//小时被选中
				this.show = false
				this.timeInfo.current  = moment(this.timeInfo.current).set("hour", this.timeInfo.selectedHour);
				this.date = moment(this.timeInfo.current).format(this.initCfg.format);
				this.$emit('cb', this.date);
				// 时间赋值给 this.date 后显示 clear 按钮
				if (this.date.length) this.initCfg.clear = true
			},
			//清空日期
			clearDate() {
				this.date = '';
				this.selectedHour=0;
				this.$emit('cb', null);
                // this.date 被清除后隐藏 clear 按钮
                if (!this.date.length) this.initCfg.clear = false
			},
			//切换显示年，月，日列表
			toggleView(view) {
				this.state.dayListShow = false
				this.state.monthListShow = false
				this.state.yearListShow = false
				switch (view) {
					case 'day':
						this.state.dayListShow = true
						break
					case 'month':
						this.state.monthListShow = true
						break
					case 'year':
						this.state.yearListShow = true
						break
					default:
						this.state.dayListShow = true
						break
				}
			},
			/**
			 * 查看当前可选日期是否小于限制的最小值
			 * @param {string} val   可选参数[year|month]
			 * @return {Boolean} true 当前时间小于最小值或大于最大值 false 当前时间大于最小值或小于最小值
			 */
			isMinLimitDate(val) {
				const minDate = moment(Date.parse(this.initCfg.minDate))
				const current = this.timeInfo.current
				if (current.get(val) <= minDate.get(val)) {
					return true
				} else {
					return false
				}
			},
			isMaxLimitDate(val) {
				const maxDate = moment(Date.parse(this.initCfg.maxDate))
				const current = this.timeInfo.current
				if (current.get(val) >= maxDate.get(val)) {
					return true
				} else {
					return false
				}
			},
			/**
			 * 判断当前是否设置有最小值或最大值
			 * @param {string} val 可选对数[minDate|maxDate]
			 * @return {Boolean} true|false
			 */
			hasDate(val) {
				if (val && moment(Date.parse(val)).format('YYYY-MM-DD') !== 'Invalid date') {
					return true
				} else {
					return false
				}
			},
			//将数字转成汉文数字
			numberToChinese(val) {
				const chinese = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
				return chinese[val - 1];
			},
			//添加0
			addZero(val) {
				val = Math.floor(val)
				if (val < 10) {
					return '0' + val
				}
				return val;
			},
			//清空日选择样式
			clearDaySelected() {
				this.daysList.map(day => {
					day.selected = false;
					return day;
				})
			},
			//返选中当前日期
			selectValue(list, value) {
				list.forEach(item => {
					if (item.inMonth && item.value === value) {
						item.selected = true
					}
				})
			},
			//获取当前元素到浏览器顶部的距离
			getAddress(ev){
				 let x = ev.x
				 let y = ev.y
				 let bottom = document.body.offsetHeight - y - 28 -60
				 if(bottom > 300){
                     this.dateToTop = {
                         top:'100%',
                         left:'0px'
					 }
				 }else if((y-60) > 300){
                     this.dateToTop = {
                         bottom:'30px',
						 top:'inherit',
						 left:'0px'
                     }
				 }else{
                     this.dateToTop = {
                         top:'inherit',
						 bottom: -(bottom)+'px',
                     }
				 }
			}

		}
	}
</script>
<template>
	<div class="date-container" @click.stop="">
		<div class="date-value"  @click.stop="getAddress">
			<div class="vaGroup">
				<input readonly type="text" :placeholder="initCfg.placeholder" v-model="date" :class='{"noclear":!initCfg.clear}'>
			</div>
			<div class="opeartion-wrap">
				<div class="opt-btn clear" @click.stop="clearDate" v-if="initCfg.clear"><i class="icon-modal__close" style="transform: scale(.8);"></i></div>
				<div class="opt-btn bl" @click.stop="togglePicker"><i class="icon-date"></i></div>
			</div>
		</div>
		<div class="date-content" :style="dateToTop" v-show="show">
			<!--页头控制-->
			<div class="content-control">
				<div class="control-year">
					<i class="arrow icon-arrow__left" :class="{'forbid':btnStatus.preYear}" @click.stop="nextYear(false)"></i>
					<span class="arrow" @click.stop="toggleView('year')">{{timeInfo.year}}</span>
					<i class="arrow icon-arrow__right" :class="{'forbid':btnStatus.nextYear}" @click.stop="nextYear(true)"></i>
				</div>
				<div class="control-month">
					<i class="arrow icon-arrow__left" :class="{'forbid':btnStatus.preMonth}" @click.stop="nextMonth(false)"></i>
					<span class="arrow" @click.stop="toggleView('month')">{{numberToChinese(timeInfo.month)}}月</span>
					<i class="arrow icon-arrow__right" :class="{'forbid':btnStatus.nextMonth}" @click.stop="nextMonth(true)"></i>
				</div>
			</div>
			<!--日列表-->
			<div class="content-days" v-show="state.dayListShow">
				<div class="weeks-item" v-for="item in weekList">
					{{item}}
				</div>
				<div v-show="state.dayListShow" class="days-item" v-for="item in daysList" track-by="$index" @click.stop="item.inMonth || item.unavailable ? chooseDay(item):''" :class="{'active':item.selected,'out-month':!item.inMonth || item.unavailable}">
					<span>{{item.value}}</span>
				</div>
			</div>
			<!--年列表-->
			<div class="content-years" v-show="state.yearListShow">
				<div class="years-item" @click.stop=" !item.unavailable ? chooseYear(item.value):''" :class="{'active':item.value==timeInfo.year,'unavailable':item.unavailable}" v-for="item in yearList">
					<span>{{item.value}}</span>
				</div>
			</div>
			<!--月列表-->
			<div class="content-years" v-show="state.monthListShow">
				<div class="years-item" @click.stop=" !item.unavailable ? chooseMonth($index):''" :class="{'active':item.value == monthList[(timeInfo.month-1)].value,'unavailable':item.unavailable}" v-for="item in monthList">
					<span>{{item.value}}</span>
				</div>
			</div>
			<div class="content-time" v-if="hasHourSelect" @click.stop=''>
				时间:
				<select v-model="timeInfo.selectedHour">
					<option v-for="hour in hourList" :value="hour">{{hour}}:00</option>
				</select>
				<button type="button" @click="timeSelected">确认</button>
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
	.date-container {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		position: relative;
		min-height: 28px;
		.date-value {
			width: 100%;
			min-height: 28px;
			display: flex;
			align-items: flex-start;
			justify-content: space-around;
			position: relative;
			.vaGroup {
				width: 100%;
			}
			input {
				width: 100%;
				height: 28px;
				padding-right: 60px;
			}
			.noclear {
				padding-right: 30px;
			}
			.date-input {
				flex: 1;
			}
		}
		.date-content {
			position: absolute;
			width: 266px;
			left: 0;
			top: 100%;
			border-radius: 4px;
			box-shadow: 0px 2px 4px 2px #f1f1f1;
			z-index: 999;
			background-color: white;
			&.date-top{
				top:inherit;
				bottom:30px;
				box-shadow: -2px 0px 4px 2px #f1f1f1;
			}
			.content-control {
				display: flex;
				align-items: center;
				height: 33px;
				padding: 0 10px;
				background-color: #ecf5ff;
				.arrow {
					cursor: pointer;
					width: 20px;
					&:hover {
						color: #03a9f4;
					}
					&.forbid {
						color: #dde8f0;
						&:hover {
							color: #dde8f0;
						}
					}
				}
				.control-year {
					margin-right: 18px;
					flex: 1;
				}
				.control-month {
					flex: 1;
				}
				* {
					display: flex;
					color: #37474f;
					font-size: 12px;
				}
				span {
					flex: 1;
					justify-content: center;
				}
			}
			.content-days {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 0 10px 8px 10px;
				.weeks-item,
				.days-item {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 35px;
					height: 35px;
					font-size: 12px;
					&:nth-of-type(7n) {
						margin-right: 0;
					}
				}
				.weeks-item {
					margin-top: 8px;
					margin-bottom: 6px;
				}
				.days-item {
					padding: 3px 6px;
					color: #212121;
					border-radius: 2px;
					&:hover {
						background-color: #dde8f0;
						cursor: pointer;
					}
				}
				.out-month {
					span {
						color: #b5c2c9;
					}
					&:hover {
						background-color: white;
						cursor: default;
						span {
							color: #b5c2c9;
						}
					}
				}
			}
			.content-years {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 266px;
				padding: 6px;
				span {
					font-size: 12px;
				}
				.years-item {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 50px;
					height: 50px;
					margin-right: 18px;
					margin-top: 17px;
					margin-bottom: 18px;
					border-radius: 2px;
					&:nth-child(4n) {
						margin-right: 0;
					}
					&:hover {
						background-color: #dde8f0;
						cursor: pointer;
					}
				}
				.unavailable {
					span {
						color: #b5c2c9;
					}
					&:hover {
						background-color: white !important;
						cursor: default;
						span {
							color: #b5c2c9;
						}
					}
				}
			}
			.content-time {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 266px;
				padding: 6px 22px;
				font-size: 12px;
				align-items: center;
				background-color: #ecf5ff;
				select {
					height: 28px;
					width: 60px;
					padding: 0;
					margin-right: 10px;
				}
				button{
					display: inline-block;
					height: 28px;
					border-radius: 2px;
					padding: 0 10px;
					border: 1px solid #03a9f4;
					background-color:#03a9f4 ;
					cursor: pointer;
					color: white;
					text-align: center;
					&:hover{
						background-color: #017cdc;
						border-color: #017cdc;
					}
				}
			}
		}
		.active {
			background-color: #03a9f4;
			cursor: pointer;
			span {
				color: white;
			}
			&:hover {
				background-color: #03a9f4 !important;
				cursor: pointer;
				span {
					color: white !important;
				}
			}
		}
		.opeartion-wrap {
			display: flex;
			flex-direction: row;
			cursor: pointer;
			height: 28px;
			align-items: center;
			position: absolute;
			right: 0;
			.opt-btn {
				width: 30px;
				height: 26px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.bl {
				border-left: 1px solid #f2f3f3;
			}
		}
	}
	/* inner-item 下的 form-group 长度统一 */
	.inner-item {
		.form-group {
			.date-container {
				.vaGroup {
					input {
						width: 210px;
					}
				}
			}
		}
	}

	.icon-date {
		margin-right: 0;
	}
</style>
