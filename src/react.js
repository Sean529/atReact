import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_CONTEXT, REACT_PROVIDER, REACT_MEMO } from "./constant"
import { wrapToVdom, shallowEqual } from "./utils"
import { Component, PureComponent } from "./Component"
import { useState, useMemo, useCallback, useReducer } from './react-dom'

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
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else {
    props.children = wrapToVdom(children)
  }

  return {
    $$typeof: REACT_ELEMENT,
    key,
    ref,
    type,
    props,
  }
}

function createRef() {
  return {
    current: null,
  }
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  }
}

const flatten = (arr) => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

const Children = {
  map(children, mapFn) {
    return flatten(children).map(mapFn)
  },
}

function createContext() {
  const context = { $$typeof: REACT_CONTEXT, }
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context
}

function cloneElement(element, newProps, ...newChildren) {
  let oldChildren = element.props && element.props.children
  oldChildren = (Array.isArray(oldChildren) ? oldChildren : [oldChildren]).filter(item => typeof item !== 'undefined').map(wrapToVdom)
  newChildren = newChildren.filter(item => typeof item !== 'undefined').map(wrapToVdom)
  let children = [...oldChildren, ...newChildren]
  const props = { ...element.props, ...newProps, children }
  if (newChildren.length > 0) {
    props.children = newChildren
  } else {
    props.children = oldChildren
  }
  if (children.length === 0) {
    children = undefined
  } else if (children.length === 1) {
    children = children[0]
  }
  return { ...element, props }
}

function memo(type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    compare,
    type
  }
}

const React = {
  createRef,
  createElement,
  Component,
  forwardRef,
  Children,
  createContext,
  cloneElement,
  PureComponent,
  memo,
  useState,
  useMemo,
  useCallback,
  useReducer,
}

export default React
