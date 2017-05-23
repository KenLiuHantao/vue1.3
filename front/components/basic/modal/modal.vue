<script type="text/javascript">
	/*
	 * TODO Config => Object
	 *  show:Boolean
	 *  width:String
	 *  height:String
	 *  header:String
	 *  btn:Array
	 *      btn>Object
	 *          name:String
	 *          className:Array     ps:btn-*-* must put 1st place
	 *          emit:String
	 * @by Fov_sweet
	 */

	export default {
		props: {
			config: Object
		},
		data() {
			return {
				headConfig: {
					rlist: false
				}
			}
		},
		methods: {
			dispatch(item) {
				this.$emit(item)
			},
			close(){
				this.config.show = false;
				this.$emit("close")
			}
		},
		filters: {
			classNameFilter(button, index) {
				let generatedClassNames = [];
				if (button.className && button.className.length) {
					button.className.forEach((item) => {
						generatedClassNames.push(item);
					})
				} else {
					if (index + 1 != this.config.btn.length) {
					    // 修改 btn-md-* 为 btn-lg-*
						generatedClassNames.push('btn-lg-def');//不是最后一个按钮
						generatedClassNames.push('mgr-10');
					}else{
                        // 修改 btn-md-* 为 btn-lg-*
						generatedClassNames.push('btn-lg-imp');//最后一个按钮
					}
				}
				return generatedClassNames;
			}
		}
	}
</script>
<template>
	<div class="modal-mask modal-transition" v-if="config.show" transition="modal">
		<div :class="['modal-area',{'mb-58':config.btn && config.btn.length}]" :style='{"width":config.width,"height":config.height}'>
			<div class="modal-header">
				{{config.header}}
				<i @click='close' class="icon-modal__close pointer"></i>
			</div>
			<slot></slot>
			<div v-if='config.btn' class="modal-foot">
				<div class="text-right" v-if='config.btn && config.btn.length < 3'>
					<button @click='dispatch(btn.emit)' v-for='btn in config.btn' :class="btn | classNameFilter $index">
						{{btn.name}}
					</button>
				</div>
				<div v-else class="text">
					<button @click='dispatch(btn.emit)' v-for='btn in config.btn'
					        :class='{"mgr-0":$index == btn.length,"btn-md-imp":$index==0||$index+1 == config.btn.length,"btn-md-def":$index!=0 && $index+1 != config.btn.length,"left":$index == 0,"mgr-10":$index!=0 && $index+1 != config.btn.length}'>
						{{btn.name}}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang='less' scoped>
	@import '../../../public/css/variable.less';

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		height: 46px;
		padding: 0 20px;
		background: #F4F7FD;
		color: #6c7a95;
		font-size: 16px;
		line-height: 46px;
		border-radius: 5px 5px 0 0;
	}

	.text {
		text-align: right;
	}

	.left {
		float: left
	}

	.mgr-0 {
		margin-right: 0 !important
	}

	.text-right {
		text-align: right;
		/*width: 100px;*/
	}

	.modal-mask,
	.moimg-mask {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.55);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: opacity .3s ease;
	}

	.modal-area {
		position: relative;
		margin: 0 auto;
		background-color: @body-bg;
		border-radius: 8px;
		transition: all .3s ease;
		box-shadow: 0 0 3px rgba(0, 0, 0, .25);
		&.mb-58 {
			padding-bottom: 58px;
		}
		.pointer {
			cursor: pointer;
		}
	}

	.modal-head {
		position: relative;
		border-bottom: 1px solid #e8e8e8;
		margin-bottom: 20px;
	}

	.modal-foot {
		position: absolute;
		padding: 15px;
		left: 0;
		bottom: 0;
		right: 0;
	}

	.dialog-btn {
		height: 28px;
		line-height: 26px;
		margin-right: 6px;
		padding: 0 15px;
		border: 1px solid #becfe4;
		background-color: transparent;
		color: #333;
		border-radius: 2px;
		font-weight: 400;
		cursor: pointer;
		text-decoration: none;
		&:hover {
			opacity: .9;
			text-decoration: none;
			border-color: #017aff;
			color: #017aff;
		}
	}

	.mgl-10 {
		margin-left: 10px;
	}

	.mgr-10 {
		margin-right: 10px;
	}

	.mgr-40 {
		margin-right: 40px;
	}

	.modal-enter,
	.modal-leave,
	.moimg-enter,
	.moimg-leave {
		opacity: 0;
	}

	.modal-enter .modal-area,
	.modal-leave .modal-area,
	.moimg-enter .moimg-area,
	.moimg-leave .moimg-area {
		-webkit-transform: scale(1.1);
		transform: scale(1.1);
	}
</style>
