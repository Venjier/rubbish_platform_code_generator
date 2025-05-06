import fs from "fs";
import path from "node:path";
import parser from '@babel/parser'
import BabelTraverse from '@babel/traverse'
import BabelTypes from '@babel/types'
import BabelGenerator from '@babel/generator'

export default async function JavaScriptHandler(script, filePath, fileName) {
    if (!script) return

    const ast = parser.parse(script, {sourceType: 'module'})  // 指定源代码是 ES 模块

    const initBody = [BabelTypes.expressionStatement(BabelTypes.callExpression(BabelTypes.identifier('vbi.package.vue.creat'), [BabelTypes.thisExpression()]))]
    const customBody = []
    const methodsBody = [
        BabelTypes.objectProperty(
            BabelTypes.identifier('NFDW'),
            BabelTypes.functionExpression(
                null,
                [],
                BabelTypes.blockStatement([])
            )
        ),
        BabelTypes.objectProperty(
            BabelTypes.identifier('init'),
            BabelTypes.functionExpression(null, [], BabelTypes.blockStatement(initBody)))
    ]


    const dataKeys = []

    // 创建 main 函数
    const functionDeclaration = BabelTypes.functionDeclaration(
        BabelTypes.identifier('main'), // 函数名称
        [], // 参数列表
        BabelTypes.blockStatement([ // 函数体
            BabelTypes.returnStatement(
                BabelTypes.objectExpression([
                    BabelTypes.objectProperty(
                        BabelTypes.identifier('name'),
                        BabelTypes.objectExpression([BabelTypes.objectProperty(BabelTypes.identifier('value'), BabelTypes.stringLiteral('com-demo')),
                            BabelTypes.objectProperty(BabelTypes.identifier('CN'), BabelTypes.stringLiteral('示例组件'))
                        ])
                    ),
                    BabelTypes.objectProperty(
                        BabelTypes.identifier('$com'),
                        BabelTypes.objectExpression([
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('method'),
                                BabelTypes.objectExpression(methodsBody)
                            ),
                        ])
                    ),
                    BabelTypes.objectProperty(
                        BabelTypes.identifier('attribute'),
                        BabelTypes.objectExpression([
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('class'),
                                BabelTypes.stringLiteral('')
                            )
                        ])
                    ),
                    BabelTypes.objectProperty(
                        BabelTypes.identifier('custom'),
                        BabelTypes.objectExpression(customBody)
                    ),
                    BabelTypes.objectProperty(
                        BabelTypes.identifier('style'),
                        BabelTypes.objectExpression([
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('width'),
                                BabelTypes.stringLiteral('100%')
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('height'),
                                BabelTypes.stringLiteral('100%')
                            ),
                        ])
                    ),
                    BabelTypes.objectProperty(
                        BabelTypes.identifier('binds'),
                        BabelTypes.objectExpression([
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('rows'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('label'),
                                        BabelTypes.stringLiteral('行')
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral('')
                                    ),
                                ])
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('columns'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('label'),
                                        BabelTypes.stringLiteral('列')
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral(''))
                                ])
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('values'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('label'),
                                        BabelTypes.stringLiteral('值')
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral(''))
                                ])
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('wheres'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral(''))
                                ])
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('orders'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral(''))
                                ])
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('rowCount'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral(''))
                                ])
                            ),
                            BabelTypes.objectProperty(
                                BabelTypes.identifier('options'),
                                BabelTypes.objectExpression([
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('display'),
                                        BabelTypes.booleanLiteral(true)
                                    ),
                                    BabelTypes.objectProperty(
                                        BabelTypes.identifier('info'),
                                        BabelTypes.stringLiteral(''))
                                ])
                            )
                        ])
                    ),
                    BabelTypes.objectProperty(BabelTypes.identifier('nIE'), BabelTypes.booleanLiteral(false))
                ])
            )
        ]),
        false, // 是否是生成器函数
        false // 是否是异步函数
    );

    BabelTraverse.default(ast, {
        enter(path) {
            if (BabelTypes.isObjectMethod(path.node) && path.node.key && path.node.key.name === 'mounted') {
                if (path.node.body && path.node.body.body) initBody.push(...path.node.body.body)
            }
            if (BabelTypes.isObjectMethod(path.node) && path.node.key && path.node.key.name === 'data') {
                const returnObject = path.node.body.body.find(item => item.type === 'ReturnStatement')
                customBody.push(...returnObject.argument.properties.map(item => {
                    dataKeys.push(item.key.name)
                    if (BabelTypes.isObjectMethod(item)) return functionTransform(item)
                    return item
                }))
            }
            if (BabelTypes.isObjectProperty(path.node) && path.node.key && path.node.key.name === 'methods') {
                if (path.node.value && path.node.value.properties) {
                    methodsBody.push(...path.node.value.properties.map(item => functionTransform(item)))
                }
            }
        },
        MemberExpression(path) { // 给 data 中的变量引用加上 custom
            if (BabelTypes.isThisExpression(path.node.object) && BabelTypes.isIdentifier(path.node.property)) {
                if (path.node.property.name === 'custom' || !dataKeys.includes(path.node.property.name)) return
                path.node.object = parser.parseExpression('this.custom');
            }
        }
    });


    const program = BabelTypes.program([functionDeclaration]); // 创建一个文件节点

    const file = BabelTypes.file(BabelTypes.program(program.body)); // 创建一个文件对象

    const {code: generatedCode} = BabelGenerator.generate(file, {
        jsescOption: {
            minimal: true // 设置 minimal 为 true，避免转义中文字符
        },
        presets: ['@babel/preset-env'],
    });


    fs.writeFile(path.join(filePath, fileName, fileName + '.js'), generatedCode, (err) => {
    })
}

function functionTransform(func) {
    if (!BabelTypes.isObjectMethod(func)) throw new Error('This is not a function')
    if (func.key.name === 'add') console.log(func.body.body[0].expression.arguments[0].properties)
    const params = func.params.map(item => BabelTypes.identifier(item.name))
    return BabelTypes.objectProperty(BabelTypes.identifier(func.key.name), BabelTypes.functionExpression(null, params, func.body, func.generator, func.async))
}