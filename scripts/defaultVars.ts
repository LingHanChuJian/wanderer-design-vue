import { join } from 'path'
import { readFileSync } from 'fs'
import lessToJs from './lessToJs'
import { getRootPath } from './interface'

const stylePath = getRootPath('packages', 'style')
const defaultLessFile = readFileSync(join(stylePath, 'theme', 'default.less'), 'utf-8')

const defaultLess = lessToJs(`${defaultLessFile}`, { stripPrefix: true, resolveVariables: false})

export default defaultLess
