import { REACT_TEXT } from './constant'

/**
 * 把文本数字节点变为虚拟DOM节点
 * @param {*} element 元素
 * @returns 包装后的元素
 */
export function wrapToVdom(element) {
	return typeof element === 'string' || typeof element === 'number' ? {
		type: REACT_TEXT,
		props: element
	} : element
}

export function shallowEqual(obj1, obj2) {
	if (obj1 === obj2) return true

	if (typeof obj1 !== 'object' || typeof obj1 === null || typeof obj2 !== 'object' || typeof obj2 === null) {
		return false
	}

	// 如果都是对象，兵器属性都存在
	const key1 = Object.keys(obj1)
	const key2 = Object.keys(obj2)
	if (key1.length !== key2.length) return false

	for(let key of key1){
		if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
			return false
		}
	}
	return true
}