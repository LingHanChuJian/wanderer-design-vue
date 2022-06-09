/**
 * @link https://github.com/michaeltaranto/less-vars-to-js/blob/master/src/index.js
 */

import stripComments from 'strip-json-comments'

export type Dictionary = { [key: string] : string }

export interface Options {
    resolveVariables?: boolean
    stripPrefix?: boolean
    dictionary?: Dictionary
}

const varRgx = /^[@$]/
const followVar = (value: string, lessVars: Dictionary, dictionary: Dictionary) => {
    if (varRgx.test(value)) {
        return followVar(lessVars[value] || dictionary[value.replace(varRgx, '')], lessVars, dictionary)
    }
    return value
}

export default function (sheet: string, options: Options) {
    const { dictionary = {}, resolveVariables = false, stripPrefix = false } = options
    const matches = stripComments(sheet).match(/[@$](.*:[^;]*)/g) || []
    let lessVars: Dictionary = {}

    matches.forEach(variable => {
        const definition = variable.split(/:\s*/);
        let value = definition.splice(1).join(':');
        value = value.trim().replace(/^["'](.*)["']$/, '$1');
        lessVars[definition[0].replace(/['"]+/g, '').trim()] = value;
    })

    if (resolveVariables) {
        Object.keys(lessVars).forEach(key => {
            const value = lessVars[key]
            lessVars[key] = followVar(value, lessVars, dictionary)
        })
    }

    if (stripPrefix) {
        const transformKey = (key: string) => key.replace(varRgx, '')

        lessVars = Object.keys(lessVars).reduce((prev, key) => {
            prev[transformKey(key)] = lessVars[key];
            return prev;
        }, {})
    }

    return lessVars
}
