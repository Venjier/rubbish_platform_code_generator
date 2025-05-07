import {parse, serialize} from "parse5";
import JavaScriptHandler from "./JavaScriptHandler.js";
import CSSHandler from "./CSSHandler.js";
import fs from "fs";
import * as path from "node:path";

export default function templateHandler(dom, fileName, filePath) {

    const DomObj = parse(dom)
    const stack = [DomObj]
    let template = null

    const methodsNames = [], customNames = []
    while (stack.length) {
        const node = stack.shift()

        if (node.nodeName === 'script') {
            const {methodsKeys = [], dataKeys = []} = JavaScriptHandler(node.childNodes[0].value, filePath, fileName)
            methodsNames.push(...methodsKeys)
            customNames.push(...dataKeys)
        }
        if (node.nodeName === 'style') {
            CSSHandler(node.childNodes[0].value, filePath, fileName)
        }
        if (node.nodeName === 'template' && node.parentNode.nodeName === 'head') {
            template = node
        }

        if (node.childNodes) {
            stack.push(...node.childNodes)
        }
        if (node.content && node.content.childNodes) {
            stack.push(...node.content.childNodes)
        }

        if (node.tagName) {
            if (node.attrs && node.attrs.length) {
                for (let i = 0; i < node.attrs.length; i++) {
                    const attr = node.attrs[i]
                    const withParams = attr.value.indexOf('(') >= 0
                    const methodName = attr.value.substring(0, withParams ? attr.value.indexOf('(') : attr.value.length)
                    if ((attr.name.startsWith('@') || attr.name.startsWith(':') || attr.name.startsWith('v-')) && methodsNames.includes(methodName)) attr.value = `$com.method.${attr.value}`
                    if (attr.name && !attr.value) {
                        attr.name = `:${attr.name}`
                        attr.value = "true"
                    }
                }
            }
        }
    }

    fs.writeFile(path.join(filePath, fileName, fileName + '.html'), '<div>\n' + serialize(template) + '\n</div>', (err) => {
    })
}