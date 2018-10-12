const ReactDom = {
    
}
//convert jsx string to real dom
const getDomFromJsx = jsx => {
    const div = document.createElement('div')
    div.innerHTML = jsx
    return div
}

ReactDom.render = function(jsx, dom) {
    const appendDom = getDomFromJsx(jsx);
    dom.appendChild(appendDom);
}
/**
 * 对于指定的dom string
 * 生成真实dom
 * 将数据放入
 * 
 * 对于变化的数据data
 * 更新视图
 * 
 * 对于变化的状态state
 * 更新视图
 * 
 * 
*/