import darkVars from './darkVars'
import defaultVars from './defaultVars'
import { writeFile } from 'fs/promises'
import { getRootPath } from './interface'

const defaultTheme = `export default ${JSON.stringify(defaultVars)}`
const darkTheme = `export default ${JSON.stringify(darkVars)}`
const theme = 
`import darkVars from './dark-theme'
import defaultVars from './default-theme'

export type ModifyVars = { [key: string] : string }

function themeVariables(dark = false, modifyVars: ModifyVars = {}) {
    return Object.assign(dark ? {...defaultVars, ...darkVars} : defaultVars, modifyVars)
}

export default {
    defaultVars,
    darkVars: {...defaultVars, ...darkVars},
    themeVariables
}`


const themePath = getRootPath('dist', 'theme.ts')
const darkThemePath = getRootPath('dist', 'dark-theme.ts')
const defaultThemePath = getRootPath('dist', 'default-theme.ts') 

async function writeThemeFile() {
    await writeFile(themePath, theme)
    await writeFile(darkThemePath, darkTheme)
    await writeFile(defaultThemePath, defaultTheme)
}

export default writeThemeFile
