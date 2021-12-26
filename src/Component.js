import { findDOM, compareTwoVdom } from './react-dom'

// 更新队列
export const updateQuery = {
	isBatchingUpdate: false, // 是否要执行批量更新
	updaters: new Set(), // updater 实例的集合
	batchUpdate() {
		updateQuery.isBatchingUpdate = false
		for (const updater of updateQuery.updaters) {
			updater.updateComponent()
		}
		updateQuery.updaters.clear()
	}
}

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
	emitUpdate(nextProps) {
		this.nextProps = nextProps
		// 如果批量更新只需要把updater添加到队列中
		if (updateQuery.isBatchingUpdate) {
			updateQuery.updaters.add(this)
		} else {
			this.updateComponent()
		}
	}
	updateComponent() {
		const { classInstance, pendingState, nextProps, callbacks } = this
		// 如果有props也走shouldUpdate
		if (nextProps || pendingState.length) {
			shouldUpdate(classInstance, nextProps, this.getState())
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

function shouldUpdate(classInstance, nextProps, nextState) {
	let willUpdate = true
	// 是否更新组件生命周期
	if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
		willUpdate = false
	}
	// 更新前触发声明周期
	if (willUpdate && classInstance.componentWillUpdate) {
		classInstance.componentWillUpdate()
	}
	// 不管页面是否要更新，state 都会更新
	classInstance.state = nextState
	// 将props挂到实例上
	if (nextProps) {
		classInstance.props = nextProps
	}
	if (willUpdate) {
		classInstance.forceUpdate()
	}
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
		// 更新类组件的时候要重新取值
		if (this.constructor.contextType) {
			this.context = this.constructor.contextType._currentValue
		}
		if (this.constructor.getDerivedStateFromProps) {
			const newState = this.constructor.getDerivedStateFromProps(this.props, this.state)
			if (newState) {
				this.state = { ...this.state, ...newState }
			}
		}
		const snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate()
		// 重新执行 render 得到新的虚拟 DOM
		const newRenderVdom = this.render()
		// 把老的虚拟 DOM 和新的虚拟 DOM 进行对比，对比得到的差异更新到真实 DOM 上
		compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
		this.oldRenderVdom = newRenderVdom
		// 组件更新后触发声明周期
		if (this.componentDidUpdate) {
			this.componentDidUpdate(this.props, this.state, snapshot)
		}
	}
}