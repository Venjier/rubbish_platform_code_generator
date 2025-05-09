import fs from 'fs'
import * as path from "node:path";
import templateHandler from "./handler/TemplateHandler.js";

export default function RubbishPlatformCodeGenerator(gloabelConfig) {
    return {
        name: 'transform-file',
        load(src, id) {
            const fileSrc = src.substring(src.lastIndexOf('?'), src.length)
            const fileType = fileSrc.substring(src.lastIndexOf('.') + 1, src.length)
            if (fileType !== 'vue') return
            const filePath = fileSrc.substring(0, src.lastIndexOf('/') + 1)
            const fileName = fileSrc.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))

            if (fileName === 'App') return;

            const exists = fs.existsSync(path.join(filePath, fileName))
            if (!exists) fs.mkdirSync(path.join(filePath, fileName))

            const content = fs.readFileSync(fileSrc, 'utf-8')

            templateHandler(content, fileName, filePath, gloabelConfig)

        },
    }
}