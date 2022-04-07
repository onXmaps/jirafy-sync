require('dotenv').config()
const jira = require('../utils/jira')
const chai = require('chai')
const key = 'JSYNC'
const badKey = 'arglebargle'

describe('Jirafy Sync', () => {
  context('Jira', () => {
    it('getProjectIdByKey - Ensure jira project keys are always uppercase', async () => {
      var resp = await jira.getProjectIdByKey(key.toLowerCase())
      chai.assert.equal(resp, '10002')
    })

    it('getProjectIdByKey - No project error', async () => {
      var resp = await jira.getProjectIdByKey(badKey)
      chai.assert.equal(resp, `Error: No project could be found with key '${badKey.toUpperCase()}'.`)
    })

    it('getProjectIdByKey - success', async () => {
      var resp = await jira.getProjectIdByKey(key)
      chai.assert.equal(resp, '10002')
    })
  })
})
