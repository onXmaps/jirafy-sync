require('dotenv').config()
const jira = require('../utils/jira')
const chai = require('chai')
const key = 'JSYNC'
const badKey = 'arglebargle'

describe('Jirafy Sync', () => {
  context('Jira', () => {
    it('getProjectIdByKey - Ensure jira project keys are always uppercase', async () => {
      console.log(`TEST 1: lowercase key: ${key.toLowerCase()}`)
      var resp = await jira.getProjectIdByKey(key.toLowerCase())
      console.log(`TEST 1 resp: ${resp}`)
      chai.assert.equal(resp, '10002')
    })

    it('getProjectIdByKey - No project error', async () => {
      var resp = await jira.getProjectIdByKey(badKey)
      chai.assert.equal(resp, `Error: No project could be found with key '${badKey.toUpperCase()}'.`)
    })

    it('getProjectIdByKey - success', async () => {
      console.log(`TEST 2: key is ${key}`)
      var resp = await jira.getProjectIdByKey(key)
      console.log(`TEST 2 resp: ${resp}`)
      chai.assert.equal(resp, '10002')
    })
  })
})
