import { join } from 'path'
import { readFileSync } from 'fs'
import lessToJs from './lessToJs'
import { getRootPath } from './interface'

const stylePath = getRootPath('packages', 'style')
const colorLessFile = readFileSync(join(stylePath, 'color', 'index.less'), 'utf-8')
const defaultLessFile = readFileSync(join(stylePath, 'theme', 'default.less'), 'utf-8')

const defaultLess = lessToJs(`${colorLessFile}${defaultLessFile}`, { stripPrefix: true, resolveVariables: false})

export default defaultLess
