import { REACT_TEXT } from './constant'

/**
 * 把文本数字节点变为虚拟DOM节点
 * @param {*} element 元素
 * @returns 包装后的元素
 */
export function warpToVdom(element) {
	return typeof element === 'string' || typeof element === 'number' ? {
		type: REACT_TEXT,
		props: element
	} : element
}

