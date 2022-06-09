import gulp from 'gulp'
import program from 'commander'
import { version } from '../../package.json'

import '../gulpfile'

const runTask = (command: string) => {
    const metadata = { task: command }
    const instance = gulp.task(command)
    if (typeof instance === 'undefined') {
        gulp.emit('task_not_found', metadata)
        return
    }
    const startTime = process.hrtime()
    gulp.emit('task_start', metadata)
    try {
        instance.apply(gulp)
        gulp.emit('finish', { ...metadata, finishTime: process.hrtime(startTime) })
    } catch(error) {
        gulp.emit('error', { ...error, ...metadata, finishTime: process.hrtime(startTime) })
    }
}

program
    .name('wanderer cli')
    .version(version)
    .argument('<task>', 'run specified tasks')
    .action((task: string) => {
        // compile  publish
        runTask(task)
    })

program.parse(process.argv)
