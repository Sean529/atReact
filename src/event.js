import { updateQuery } from './Component'
/**
 * react 合成事件
 * 为什么要合成事件？
 * 1. 面向切面变成 AOP，在事件处理之前做一些事，事件处理之后做一些事
 * 2. 处理浏览器的兼容性，提供兼容所有浏览器的统一API
 * @param {document} dom 原生dom
 * @param {string} eventType 绑定时候的属性名
 * @param {function} handler 事件处理函数
 */
export function addEvent(dom, eventType, handler) {
	const store = dom._store || (dom._store = {})
	store[eventType] = handler
	if (!document[eventType]) {
		document[eventType] = dispatchEvent
	}
}

/**
 * document 身上绑定的点击事件的事件处理函数
 * @param {object} nativeEvent 
 */
function dispatchEvent(nativeEvent) {
	updateQuery.isBatchingUpdate = true
	let { type, target } = nativeEvent
	while(target) {
		const eventType = `on${type}`
		const syntheticEvent = createSyntheticEvent(nativeEvent)
		const { _store } = target
		const handler = _store && _store[eventType]
		if (handler) {
			handler(syntheticEvent)
		}
		if (syntheticEvent.isPropagationStopped) {
			break
		}
		target = target.parentNode
	}
	updateQuery.batchUpdate()
}

function createSyntheticEvent(nativeEvent) {
	const syntheticEvent = {}
	for (const key in nativeEvent) {
		let value = nativeEvent[key]
		if (typeof value === 'function') {
			value = value.bind(nativeEvent)
		}
		syntheticEvent[key] = value
	}
	syntheticEvent.nativeEvent = nativeEvent
	syntheticEvent.isPropagationStopped = false // 是否阻止冒泡
	syntheticEvent.stopPropagation = stopPropagation // 阻止冒泡函数
	syntheticEvent.defaultPrevented = false // 是否阻止默认事件
	syntheticEvent.preventDefault = preventDefault // 阻止默认事件函数
	return syntheticEvent
}

function stopPropagation() {
	const event = this.nativeEvent
	if (event.stopPropagation) {
		event.stopPropagation()
	} else {
		event.cancelBubble = true // IE 阻止事件冒泡
	}
	this.isPropagationStopped = true
}

function preventDefault() {
	const event = this.nativeEvent
	if (event.preventDefault) {
		event.preventDefault()
	} else {
		// IE 阻止默认事件

	}
}