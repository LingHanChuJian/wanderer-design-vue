import { join } from 'path'
import { readFileSync } from 'fs'
import lessToJs from './lessToJs'
import { getRootPath } from './interface'

const stylePath = getRootPath('packages', 'style')
const darkLessPath = readFileSync(join(stylePath, 'theme', 'dark.less'), 'utf-8')

const darkLess = lessToJs(darkLessPath, { stripPrefix: true, resolveVariables: false})

export default darkLess
