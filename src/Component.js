import { findDOM, compareTwoVdom } from './react-dom'

class Updater {
	constructor(classInstance) {
		// 类组件的实例
		this.classInstance = classInstance;
		// 等待更新的状态
		this.pendingState = []
		// 更新后的回调
		this.callbacks = []
	}
	addState(partialState, callback) {
		this.pendingState.push(partialState)
		// 接收函数更新state
		if (typeof callback === 'function') {
			this.callbacks.push(callback)
		}
		this.emitUpdate()
	}
	emitUpdate() {
		this.updateComponent()
	}
	updateComponent() {
		const { classInstance, pendingState, callbacks } = this
		if (pendingState.length) {
			shouldUpdate(classInstance, this.getState())
		}
		// 回调执行
		if (callbacks.length) {
			callbacks.forEach(callback => callback())
			callbacks.length = 0
		}
	}
	getState() {
		const { classInstance, pendingState } = this
		let { state } = classInstance
		pendingState.forEach(partialState => {
			// 如果是函数则返回函数执行后的结果
			if (typeof partialState === 'function') {
				partialState = partialState(state)
			}
			state = { ...state, ...partialState }
		})
		pendingState.length = 0
		return state
	}
}

function shouldUpdate(classInstance, nextState) {
	classInstance.state = nextState
	classInstance.forceUpdate()
}

export class Component {
	static isReactClassComponent = true
	constructor(props) {
		this.props = props
		this.state = {}
		this.updater = new Updater(this)
	}
	setState(partialState, callback) {
		this.updater.addState(partialState, callback)
	}
	forceUpdate() {
		// 获取此组件上一次 render 渲染出来的虚拟 DOM
		const oldRenderVdom = this.oldRenderVdom
		// 获取虚拟 DOM 对应的真实 DOM oldRenderVdom.dom 
		const oldDOM = findDOM(oldRenderVdom)
		// 重新执行 render 得到新的虚拟 DOM
		const newRenderVdom = this.render()
		// 把老的虚拟 DOM 和新的虚拟 DOM 进行对比，对比得到的差异更新到真实 DOM 上
		compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
		this.oldRenderVdom = newRenderVdom
	}
}