#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const changeCase = require('change-case')

const run = (name, options) => {
  console.log('making react component', name)

  const componentName = changeCase.pascalCase(name)
  const titleComponentName = changeCase.titleCase(name)

  const atom = options.type ? `${options.type}s` : ''
  const dir = path.resolve(
    'src',
    'components',
    atom,
    componentName,
  )
  const jsPath = path.resolve(dir, componentName + '.js')
  const storyPath = path.resolve(
    dir,
    componentName + '.stories.js',
  )
  const testPath = path.resolve(
    dir,
    componentName + '.test.js',
  )
  const indexPath = path.resolve(dir, 'index.js')

  const jsContent = `import React from 'react'
import PropTypes from 'prop-types'
import glam from 'glamorous'

const ${componentName}Root = glam.div({})

const ${componentName} = props => (<${componentName}Root>${componentName}</${componentName}Root>)

export default ${componentName}
`

  const indexContent = `export { default, default as ${componentName} } from './${componentName}'
  `

  const storyContent = `import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ${componentName} from '.'

storiesOf('${titleComponentName}', module).add('default', () => (
  <${componentName} />
))
`
  const testContent = `import React from 'react'
import { shallow } from 'enzyme'
import ${componentName} from '.'

const wrap = (props = {}) => shallow(<${componentName} {...props} />)

describe('${titleComponentName} test', () => {
  it('renders children when passed in', () => {
    const wrapper = wrap()
    expect(wrapper).toMatchSnapshot()
  })
})
`

  fs.mkdirSync(dir)
  fs.writeSync(fs.openSync(jsPath, 'w'), jsContent)
  fs.writeSync(fs.openSync(storyPath, 'w'), storyContent)
  fs.writeSync(fs.openSync(testPath, 'w'), testContent)
  fs.writeSync(fs.openSync(indexPath, 'w'), indexContent)
  console.log('Finished making', componentName)
}

program
  .version('0.0.3')
  .option('-t, --type <type>', 'atomic component')
  .arguments('<name>')
  .action(run)
  .parse(process.argv)
