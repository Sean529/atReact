import { REACT_TEXT } from './constant'

function render(vdom, container) {
	mount(vdom, container)
}

/**
 * 挂载真实dom
 * @param {object} vdom 虚拟dom
 * @param {document} container 容器
 */
function mount(vdom, container) {
	const dom = createDOM(vdom)
	container.appendChild(dom)
}

/**
 * 把虚拟dom转成真实dom
 * @param {object} vdom 虚拟dom
 * @returns 真实dom
 */
function createDOM(vdom) {
	const { type, props } = vdom
	let dom
	if (type === REACT_TEXT) {
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
			mount(children, dom)
		} else if (Array.isArray(children)) {
			reconcileChildren(children, dom)
		}
	}

	// 让vdom的dom属性指向创建出来的真实dom
	vdom.dom = dom
	return dom
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
	const { type: ClassComponent, props } = vdom
	const classInstance = new ClassComponent(props)
	const renderVdom = classInstance.render()
	// 把上次render渲染得到的虚拟dom挂载
	vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}

/**
 * 处理子元素，将子元素挂载到父元素上
 * @param {array} children 虚拟dom子元素
 * @param {document} parentDOM 父元素
 */
function reconcileChildren(children, parentDOM) {
	children.forEach(vdom => {
		mount(vdom, parentDOM)
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
			dom[key.toLowerCase()] = newProps[key]
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
		const oldRenderVdom = vdom.oldRenderVdom
		return findDOM(oldRenderVdom)
	}
}

/**
 * 进行DOM-DIFF
 * @param {document} parentDOM 父真实dom节点
 * @param {object} oldVdom 老的虚拟dom
 * @param {object} newVdom 新的虚拟dom
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
	const oldDOM = findDOM(oldVdom)
	const newDOM = createDOM(newVdom)
	parentDOM.replaceChild(newDOM, oldDOM)
}

const ReactDOM = {
	render
}

export default ReactDOM
