import { findDOM, compareTwoVdom } from './react-dom'

class Updater {
	constructor(classInstance) {
		this.classInstance = classInstance;
		this.pendingState = []
	}
	addState(partialState) {
		this.pendingState.push(partialState)
		this.emitUpdate()
	}
	emitUpdate() {
		this.updateComponent()
	}
	updateComponent() {
		const { classInstance, pendingState } = this
		if (pendingState.length) {
			shouldUpdate(classInstance, this.getState())
		}
	}
	getState() {
		const { classInstance, pendingState } = this
		let { state } = classInstance
		pendingState.forEach(partialState => {
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
	setState(partialState) {
		this.updater.addState(partialState)
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