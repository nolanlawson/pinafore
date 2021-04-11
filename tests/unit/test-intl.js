// this test is to make sure I don't shoot myself in the foot and typo something and show the user
// a string like intl.nameOfThing rather than "Name of Thing"

/* global describe it */

import enIntl from '../../src/intl/en-US'
import globby from 'globby'
import path from 'path'
import { promisify } from 'util'
import fs from 'fs'
import assert from 'assert'

const readFile = promisify(fs.readFile)

describe('test-intl.js', () => {
  it('has no unused intl strings', async () => {
    const keys = Object.keys(enIntl)

    const allSourceFilenames = (await globby([path.join(__dirname, '../../src/**/*.{js,html,json}')]))
      .filter(file => !file.includes('/intl/'))
    const allSourceFiles = await Promise.all(
      allSourceFilenames.map(async name => ({ name, content: await readFile(name, 'utf8') }))
    )
    for (const key of keys) {
      assert(
        allSourceFiles.some(({ content }) => content.includes(`intl.${key}`)),
        `Unused intl string: ${JSON.stringify(key)}`
      )
    }
  })
})
