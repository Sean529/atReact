import { REACT_ELEMENT } from './constant'
import { warpToVdom } from './utils'

/**
 * 用来创建 React 元素的工厂方法
 * @param {string} type 元素类型
 * @param {object} config 配置对象
 * @param {array} children 儿子们
 * @returns object 虚拟DOM
 */
function createElement(type, config, children) {
	let key
	let ref
	if (config) {
		key = config.key
		ref = config.ref
		delete config.key
		delete config.ref
		delete config.__source
		delete config.__self
	}
	const props = { ...config }
	props.children = arguments.length > 3 ? Array.prototype.slice.call(arguments, 2) : children

	if (arguments.length > 3) {
		props.children = Array.prototype.slice.call(arguments, 2).map(warpToVdom)
	} else {
		props.children = warpToVdom(children)
	}

	return {
		'$$typeof': REACT_ELEMENT,
		key,
		ref,
		type,
		props,
	}
}
const React = {
	createElement
}
export default React