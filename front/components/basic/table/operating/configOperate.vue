<script type="text/javascript">
	/*
	 * 配置使用注意事项
	 * 1、props 不能修改
	 * 2、operatingItem() 不能修改
	 *
	 */
	export default {
		props: ['index', 'current', 'data', 'config'],
		methods: {
			operatingItem(index) {
				this.current = index
			},
			operate(type) {
				if (type && typeof type == "function") {
					type(this.data);
				} else {
					this.$emit('cb', type, this.data)
				}
			}
		},
		computed: {
			computedButtons(){
				var buttons = this.config;
				buttons.forEach(function (button) {
					if (!button.show) {
						button.show = function () {
							return true;
						}
					}
					if (!button.func) {
						button.func=function(){
							return true
						}
					}
				});
				return buttons;
			},
			showAll(){
				var flag=false;
				for(var i=0;i<this.computedButtons.length;i++){
					if(this.computedButtons[i].show(this.data) && this.computedButtons[i].func(this.data)){
						flag=true
						break
					}
				}
				return flag
			}
		}
	}
</script>
<template>
	<div class="opt-wrap">
		<!--<div class="more-group" v-show='index == current && showAll'>-->
		<div v-if='computedButtons.length>1' class="more-group">
			<template v-for="obj in computedButtons">
				<a  v-if="obj.show(data) && obj.func(data)" :class='obj.type' @click.stop='operate(obj.btn)' href="javascript:;">{{ obj.text }}</a>
			</template>
		</div>
		<!--<div v-show='showAll' :class='["dot-group" ,"more",{"ckd":index == current}]' @click.stop='operatingItem(index)'>-->
		<div v-if='computedButtons.length>1' v-show='showAll' class='dot-group more"' @click.stop='operatingItem(index)'>
			<span></span><span></span><span></span>
		</div>
		<div v-if='computedButtons.length===1' v-show='showAll' class='dot-group-only' @click.stop='operatingItem(index)'>
			<a class="button-primary" href="javascript:;" v-if="computedButtons[0].show(data) && computedButtons[0].func(data)" :class='computedButtons[0].type' @click.stop='operate(computedButtons[0].btn)'>{{ computedButtons[0].text }}</a>
		</div>
	</div>
</template>
<style lang='less' scoped>
	@import '../../../../public/css/variable.less';
	.table-list tbody tr:hover .dot-group {
		background: rgba(255,255,255,0.5);
		border: 1px solid #d4d4d4;
	}

	.opt-wrap{
		position: relative;
		display: inline-block;
	}
	.opt-wrap:hover  .more-group{
		display: block;
	}
	.dot-group-only{
		display: flex;
		height: 24px;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		cursor: pointer;
		&:hover span {
			background-color: @link-color;
		}
		a{
			color: #03a9f4;
		}
	}
	.dot-group {
		display: flex;
		width: 46px;
		height: 28px;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		cursor: pointer;
		border-radius: 4px;
		&:hover span {
			background-color: @link-color;
		}
		&:hover{
			border: 1px solid #87DAFF !important;
			background: rgba(255,255,255,0.5);
		}
		span {
			display: flex;
			width: 5px;
			height: 5px;
			margin: 0 2px;
			border-radius: 50%;
			background-color: #ADADAD;
		}
		a{
			color: #03a9f4;
		}
	}

	.more-group {
		position: absolute;
		display: none;
		top: 40%;
		left: 14px;
		padding: 4px 0;
		margin-top: 14px;
		margin-left: -32px;
    	width: 85px;
		z-index: 3;
		background-color: @body-bg;
		border: 1px solid @border-color;
		box-shadow: 0 1px 2px #F2F3F3;
		&:hover + .dot-group {
			background: rgba(255,255,255,0.5);
			border: 1px solid #87DAFF !important;

			span {
				background-color: @link-color;
			}
		}
		a {
			display: block;
			text-align: center;
			font-size: 12px;
			padding: 5px 0;
			height: 25px;
			box-sizing: border-box;
			&:hover {
				background-color: #EBF7FD;
			}
		}
		&:before {
			content: '';
			position: absolute;
			top: -17px;
			left: calc(~"50% - 4px");
			margin-left: -5px;
			display: inline-block;
			width: 0;
			border: 8px solid transparent;
			border-bottom-color: @border-color;
		}
		&:after {
			content: '';
			position: absolute;
			top: -16px;
			left: calc(~"50% - 4px");
			margin-left: -5px;
			display: inline-block;
			width: 0;
			border: 8px solid transparent;
			border-bottom-color: @body-bg;
		}
		.blue {
			color: #008AF5;
		}
		.danger {
			color: #FF0700;
		}
		.normal {
			color: #757575;
		}
	}
</style>
