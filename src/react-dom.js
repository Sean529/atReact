import { REACT_TEXT, REACT_FORWARD_REF, PLACEMENT, MOVE, REACT_CONTEXT, REACT_PROVIDER, REACT_MEMO } from './constant'
import { addEvent } from './event'

let hookStates = []
let hookIndex = 0
let scheduleUpdate
function render(vdom, container) {
	mount(vdom, container)
	scheduleUpdate = () => {
		hookIndex = 0
		compareTwoVdom(container, vdom, vdom)
	}
}

export function useReducer(reducer, initialState) {
	hookStates[hookIndex] = hookStates[hookIndex] || initialState
	const currentIndex = hookIndex
	function dispatch(action) {
		hookStates[currentIndex] = reducer(hookStates[currentIndex], action)
		scheduleUpdate()
	}
	return [hookStates[hookIndex++], dispatch]
}

export function useMemo(factory, deps) {
	if (hookStates[hookIndex]) {
		const [oldMemo, oldDeps] = hookStates[hookIndex]
		const same = deps.every((dep, index) => dep === oldDeps[index])
		if (same) {
			hookIndex++
			return oldMemo
		}
	}
	const newMemo = factory()
	hookStates[hookIndex++] = [newMemo, deps]
	return newMemo
}

export function useCallback(callback, deps) {
	if (hookStates[hookIndex]) {
		const [oldCallback, oldDeps] = hookStates[hookIndex]
		const same = deps.every((dep, index) => dep === oldDeps[index])
		if (same) {
			hookIndex++
			return oldCallback
		}
	}
	hookStates[hookIndex++] = [callback, deps]
	return callback
}

export function useState(initialState) {
	hookStates[hookIndex] = hookStates[hookIndex] || initialState
	const currentIndex = hookIndex
	function setState(newState) {
		hookStates[currentIndex] = newState
		scheduleUpdate()
	}
	return [hookStates[hookIndex++], setState]
}

/**
 * 挂载真实dom
 * @param {object} vdom 虚拟dom
 * @param {document} container 容器
 */
function mount(vdom, container) {
	const dom = createDOM(vdom)
	if (dom) {
		container.appendChild(dom)
		// dom 渲染完成后触发声明周期
		if (dom.componentDidMount) {
			dom.componentDidMount()
		}
	}
}

/**
 * 把虚拟dom转成真实dom
 * @param {object} vdom 虚拟dom
 * @returns 真实dom
 */
function createDOM(vdom) {
	const { type, props, ref } = vdom
	let dom
	if (type && type.$$typeof === REACT_MEMO) {
		return mountMemoComponent(vdom)
	} else if (type && type.$$typeof === REACT_FORWARD_REF) {
		return mountForwardComponent(vdom)
	} else if (type && type.$$typeof === REACT_PROVIDER) { // Provider
		return mountProviderComponent(vdom)
	} else if (type && type.$$typeof === REACT_CONTEXT) { // Consumer
		return mountContextComponent(vdom)
	} else if (type === REACT_TEXT) {
		dom = document.createTextNode(props)
	} else if (typeof type === 'function') {
		if (type.isReactClassComponent) {
			return mountClassComponent(vdom)
		} else {
			return mountFunctionComponent(vdom)
		}
	} else {
		dom = document.createElement(type)
	}

	if (props) {
		updateProps(dom, null, props)
		const { children } = props
		if (typeof children === 'object' && children.type) {
			children.mountIndex = 0
			mount(children, dom)
		} else if (Array.isArray(children)) {
			reconcileChildren(children, dom)
		}
	}

	// 让vdom的dom属性指向创建出来的真实dom
	vdom.dom = dom

	if (ref) {
		ref.current = dom
	}
	return dom
}

function mountMemoComponent(vdom) {
	// type函数本身
	const { type: { type: FunctionComponent }, props } = vdom
	// 把属性对象传给函数执行，返回要渲染的虚拟dom
	const renderVdom = FunctionComponent(props)
	vdom.preProps = props
	// vdom.老的要渲染的虚拟DOM = renderVdom，用于dom diff
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}

function mountProviderComponent(vdom) {
	const { type, props } = vdom
	const context = type._context
	context._currentValue = props.value
	const renderVdom = props.children
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}

function mountContextComponent(vdom) {
	const { type, props } = vdom
	const context = type._context
	const renderVdom = props.children(context._currentValue)
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}

function mountForwardComponent(vdom) {
	const { type, props, ref } = vdom
	const renderVdom = type.render(props, ref)
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}

/**
 * 挂载函数组件
 * @param {object} vdom 虚拟dom
 * @returns 真实dom
 */
function mountFunctionComponent(vdom) {
	// type函数本身
	const { type, props } = vdom
	// 把属性对象传给函数执行，返回要渲染的虚拟dom
	const renderVdom = type(props)
	// vdom.老的要渲染的虚拟DOM = renderVdom，用于dom diff
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}

/**
 * 挂载类组件
 * @param {object} vdom 虚拟dom
 * @returns 真实dom
 */
function mountClassComponent(vdom) {
	const { type: ClassComponent, props, ref } = vdom
	const classInstance = new ClassComponent(props)
	vdom.classInstance = classInstance
	if (ClassComponent.contextType) {
		classInstance.context = ClassComponent.contextType._currentValue
	}
	// 让 ref.current 指向类组件的实例
	if (ref) {
		ref.current = classInstance
	}
	// dom挂载前触发生命周期
	if (classInstance.componentWillMount) {
		classInstance.componentWillMount()
	}
	const renderVdom = classInstance.render()
	// 把上次render渲染得到的虚拟dom挂载
	classInstance.oldRenderVdom = renderVdom
	const dom = createDOM(renderVdom)
	// dom 上挂个声明周期函数，在渲染完成后触发该函数
	if (classInstance.componentDidMount) {
		dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
	}
	return dom
}

/**
 * 处理子元素，将子元素挂载到父元素上
 * @param {array} children 虚拟dom子元素
 * @param {document} parentDOM 父元素
 */
function reconcileChildren(children, parentDOM) {
	children.forEach((child, index) => {
		child.mountIndex = index
		mount(child, parentDOM)
	})
}

/**
 * 更新属性
 * @param {document} dom 真实dom
 * @param {object} oldProps 老的属性
 * @param {object} newProps 新的属性
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
	for (const key in newProps) {
		if (key === 'children') {
			continue
		} else if (key === 'style') {
			const styleObj = newProps[key]
			for (const attr in styleObj) {
				dom.style[attr] = styleObj[attr]
			}
		} else if (/^on[A-Z].*/.test(key)) {
			// dom[key.toLowerCase()] = newProps[key]
			addEvent(dom, key.toLowerCase(), newProps[key])
		} else {
			dom[key] = newProps[key]
		}
	}
	// 若老属性上的值，新属性没有，则删除老的
	for (const key in oldProps) {
		if (!newProps.hasOwnProperty(key)) {
			dom[key] = null
		}
	}
}

export function findDOM(vdom) {
	if (!vdom) return null
	// 如果vdom上有dom属性，说明这个vdom是一个原生组件
	if (vdom.dom) {
		return vdom.dom // 返回它对应的真实DOM即可
	} else {
		// 它可能是一个函数组件或类组件
		const renderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom
		return findDOM(renderVdom)
	}
}

/**
 * 进行DOM-DIFF
 * @param {document} parentDOM 父真实dom节点
 * @param {object} oldVdom 老的虚拟dom
 * @param {object} newVdom 新的虚拟dom
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
	if (!oldVdom && !newVdom) {
		return
	} else if (oldVdom && !newVdom) {
		unMountVdom(oldVdom)
	} else if (!oldVdom && newVdom) {
		didMountVdom(parentDOM, newVdom, nextDOM)
	} else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
		unMountVdom(oldVdom)
		didMountVdom(parentDOM, newVdom, nextDOM)
	} else {
		updateElement(oldVdom, newVdom)
	}
}

/**
 * 深度比较新老dom差异，把差异同步到真实dom
 * @param {object} oldVdom 老的虚拟dom
 * @param {object} newVdom 新的虚拟dom
 */
function updateElement(oldVdom, newVdom) {
	if (oldVdom.type.$$typeof === REACT_MEMO) {
		updateMemoComponent(oldVdom, newVdom)
	} else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
		updateContextComponent(oldVdom, newVdom)
	} else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
		updateProviderComponent(oldVdom, newVdom)
	} else if (oldVdom.type === REACT_TEXT) {
		// 如果是文本节点
		const currentDOM = newVdom.dom = findDOM(oldVdom)
		if (oldVdom.props !== newVdom.props) {
			currentDOM.textContent = newVdom.props
		}
	} else if (typeof oldVdom.type === 'string') {
		const currentDOM = newVdom.dom = findDOM(oldVdom)
		updateProps(currentDOM, oldVdom.props, newVdom.props)
		updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
	} else if (typeof oldVdom.type === 'function') {
		if (oldVdom.type.isReactClassComponent) {
			updateClassComponent(oldVdom, newVdom)
		} else {
			updateFunctionComponent(oldVdom, newVdom)
		}
	}
}

function updateMemoComponent(oldVdom, newVdom) {
	const { type: { compare }, prevProps, } = oldVdom
	if (!compare(prevProps, newVdom.props)) {
		const currentDOM = findDOM(oldVdom)
		if (!currentDOM) return
		const parentDOM = currentDOM.parentNode
		const { type: { type: FunctionComponent }, props } = newVdom
		const newRenderVdom = FunctionComponent(props)
		compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
		newVdom.prevProps = props
		newVdom.oldRenderVdom = newRenderVdom
	} else {
		newVdom.prevProps = prevProps
		newVdom.oldRenderProps = oldVdom.oldRenderVdom
	}
}

function updateProviderComponent(oldVdom, newVdom) {
	const currentDOM = findDOM(oldVdom)
	if (!currentDOM) return
	const parentDOM = currentDOM.parentNode
	const { type, props } = newVdom
	const context = type._context
	context._currentValue = props.value
	const newRenderVdom = props.children
	compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
	newVdom.oldRenderVdom = newRenderVdom
}

function updateContextComponent(oldVdom, newVdom) {
	const currentDOM = findDOM(oldVdom)
	if (!currentDOM) return
	const parentDOM = currentDOM.parentNode
	const { type, props } = newVdom
	const context = type._context
	const newRenderVdom = props.children(context._currentValue)
	compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
	newVdom.oldRenderVdom = newRenderVdom
}

function updateClassComponent(oldVdom, newVdom) {
	// 让新的虚拟DOM对象复用老的类组件实例
	const classInstance = newVdom.classInstance = oldVdom.classInstance
	//  如果有componentWillReceiveProps生命周期则执行并把新的props传过去
	if (classInstance.componentWillReceiveProps) {
		classInstance.componentWillReceiveProps(newVdom.props)
	}
	// 通知更新组件
	classInstance.updater.emitUpdate(newVdom.props)
}

function updateFunctionComponent(oldVdom, newVdom) {
	const currentDOM = findDOM(oldVdom)
	if (!currentDOM) return
	const parentDOM = currentDOM.parentNode
	const { type, props } = newVdom
	const newRenderVdom = type(props)
	compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
	newVdom.oldRenderVdom = newRenderVdom
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
	oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]).filter(item => item)
	newVChildren = (Array.isArray(newVChildren) ? newVChildren : [newVChildren]).filter(item => item)

	// 把老节点存放入到一个以key为属性，以节点为值的对象中
	const keyedOldMap = {}
	let lastPlacedIndex = 0
	oldVChildren.forEach((oldVChild, index) => {
		keyedOldMap[oldVChild.key || index] = oldVChild
	})

	let patch = []
	newVChildren.forEach((newVChild, index) => {
		const newKey = newVChild.key || index
		const oldVChild = keyedOldMap[newKey]
		if (oldVChild) {
			// 更新老节点
			updateElement(oldVChild, newVChild)
			if (oldVChild.mountIndex < lastPlacedIndex) {
				patch.push({
					type: MOVE,
					oldVChild,
					newVChild,
					mountIndex: index
				})
			}
			delete keyedOldMap[newKey]
			lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex)
		} else {
			patch.push({
				type: PLACEMENT,
				oldVChild,
				newVChild,
				mountIndex: index
			})
		}
	})

	// 获取所有的要移动的老节点
	const moveChild = patch.filter(action => action.type === MOVE).map(action => action.oldVChild)
	// 把剩下的没有复用到的老节点和要移动的节点全部从DOM树中删除
	const deleteVChildren = Object.values(keyedOldMap)
	deleteVChildren.concat(moveChild).forEach(oldVChild => {
		const currentChild = findDOM(oldVChild)
		parentDOM.removeChild(currentChild)
	})

	if (patch.length) {
		patch.forEach(action => {
			const { type, oldVChild, newVChild, mountIndex } = action
			const childNodes = parentDOM.childNodes
			let currentDOM
			if (type === PLACEMENT) {
				currentDOM = createDOM(newVChild)
			} else if (type === MOVE) {
				currentDOM = findDOM(oldVChild)
			}
			const childNode = childNodes[mountIndex]
			if (childNode) {
				parentDOM.insertBefore(currentDOM, childNode)
			} else {
				parentDOM.appendChild(currentDOM)
			}
		})
	}
}

function didMountVdom(parentDOM, vdom, nextDOM) {
	const newDOM = createDOM(vdom)
	if (nextDOM) {
		parentDOM.insertBefore(newDOM, nextDOM)
	} else {
		parentDOM.appendChild(newDOM)
	}
	if (newDOM.componentDidMount) {
		newDOM.componentDidMount()
	}
}

function unMountVdom(vdom) {
	const { props, ref } = vdom
	// 获取当前真实DOM
	const currentDOM = findDOM(vdom)
	// 如果 vdom 上有 classInstance 说明是类组件
	if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
		// 执行类组件卸载声明周期
		vdom.classInstance.componentWillUnmount()
	}
	if (ref) {
		ref.current = null
	}
	if (props.children) {
		const children = Array.isArray(props.children) ? props.children : [props.children]
		children.forEach(unMountVdom)
	}
	// 把此虚拟DOM对应的老的DOM节点从父节点中移除
	if (currentDOM) {
		currentDOM.parentNode.removeChild(currentDOM)
	}
}

const ReactDOM = {
	render
}

export default ReactDOM
