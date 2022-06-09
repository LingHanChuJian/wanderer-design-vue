import less from 'less'
import postcss from 'postcss'
import { dirname } from 'path'
import autoprefixer from 'autoprefixer'
import { getRootPath } from './interface'

export default async function (content: string, lessFilePath: string) {
    const resolvedLessFilePath = getRootPath(lessFilePath)

    const lessOptions = {
        paths: [dirname(resolvedLessFilePath)],
        filename: resolvedLessFilePath,
        javascriptEnabled: true
    }

    const result = await less.render(content, lessOptions)
    const r = await postcss([autoprefixer]).process(result.css, { from: undefined })
    return r.css
}