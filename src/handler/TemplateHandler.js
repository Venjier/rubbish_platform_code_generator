import {parse, serialize} from "parse5";
import JavaScriptHandler from "./JavaScriptHandler.js";
import CSSHandler from "./CSSHandler.js";
import fs from "fs";
import * as path from "node:path";

export default function templateHandler(dom, fileName, filePath) {

    const DomObj = parse(dom)
    const stack = [DomObj]
    let template = null

    while (stack.length) {
        const node = stack.shift()

        if (node.nodeName === 'script') {
            JavaScriptHandler(node.childNodes[0].value, filePath, fileName)
        }
        if (node.nodeName === 'style') {
            CSSHandler(node.childNodes[0].value, filePath, fileName)
        }
        if (node.nodeName === 'template') {
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
                    if (attr.name.startsWith('@')) attr.value = `$com.method.${attr.value}`
                }
            }
        }
    }

    fs.writeFile(path.join(filePath, fileName, fileName + '.html'), '<div>\n' + serialize(template) + '\n</div>', (err) => {
    })
}