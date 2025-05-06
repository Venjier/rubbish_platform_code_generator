import * as sass from 'sass'
import fs from "fs";
import path from "node:path";

export default function CSSHandler(css, filePath, fileName) {
    if (!css || typeof css !== 'string') return
    fs.writeFile(path.join(filePath, fileName, fileName + '.css'), sass.compileString(css).css, (err) => {
    })
}