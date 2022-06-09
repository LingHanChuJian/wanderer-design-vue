import type { TaskCallback } from 'undertaker'

import { writeFile } from 'fs/promises'
import { getRootPath } from './interface'
import { version } from '../package.json'

const versionPath = getRootPath('packages', 'version.ts')

async function writeVersionFile(done: TaskCallback) {
    await writeFile(
        versionPath,
        `const version = '${version}'\nexport default version\n`)
    done()
}

export default writeVersionFile
