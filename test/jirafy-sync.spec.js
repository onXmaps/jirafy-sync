require('dotenv').config()
const jira = require('../utils/jira')
const { parseChangelogForJiraTickets } = require('../utils/jira-helper')
const chai = require('chai')
const core = require('@actions/core')
const key = 'SDET'
const badKey = 'arglebargle'

describe('Jirafy Sync', () => {
  var projectId
  var changelog =
    '* [`4f94449`](http://github.com/onXmaps/jirafy-changelog/commit/4f94449419698e134785e58ceac74702ab47781b)  [`JIRAFY-5`](https://coltdorsey.atlassian.net/browse/JIRAFY-5) Readme example release update - Merge pull request #5 from coltdorsey/colt/readme-example-release \
  * [`58e69be`](http://github.com/onXmaps/jirafy-changelog/commit/58e69be6433c786c2618536dc1d1dbbdde30a461)  [`JIRAFY-6`](https://coltdorsey.atlassian.net/browse/JIRAFY-6) Image reference fix - Merge pull request #6 from coltdorsey/colt/image-reference-fix \
  * [`1109803`](http://github.com/onXmaps/jirafy-changelog/commit/110980389e537555e257b5a1b07a683a3966eef8) Configure Renovate - Merge pull request #1 from coltdorsey/renovate/configure \
  * [`76bc40f`](http://github.com/onXmaps/jirafy-changelog/commit/76bc40f804cdfe7e42d12c985576fdec21e269a8) Update coltdorsey/jirafy-changelog action to v1.1.0 - Merge pull request #8 from coltdorsey/renovate/coltdorsey-jirafy-changelog-1.x \
  * [`af798a0`](http://github.com/onXmaps/jirafy-changelog/commit/af798a09f8f97c858c4631f760ab995889144779) Update dependency prettier to v2.5.1 - Merge pull request #13 from coltdorsey/renovate/prettier-2.x \
  * [`802f2d5`](http://github.com/onXmaps/jirafy-changelog/commit/802f2d59003a81855c0367afe521979424d7039c) Update dependency eslint to v8.4.1 - Merge pull request #11 from coltdorsey/renovate/eslint-8.x \
  * [`2616445`](http://github.com/onXmaps/jirafy-changelog/commit/26164452d005d08b01bc266abc49de2eae70260c) Update dependency @vercel/ncc to v0.33.0 - Merge pull request #10 from coltdorsey/renovate/vercel-ncc-0.x \
  * [`ce73404`](http://github.com/onXmaps/jirafy-changelog/commit/ce73404ce5cb38c9c6a86b6188a790e76a7575fb)  [`SDET-486`](https://coltdorsey.atlassian.net/browse/SDET-486) Updating references - Merge pull request #22 from onXmaps/colt/update-references'

  before(() => {
    core.setSecret('projectId')
    projectId = process.env.PROJECT_ID
  })

  context('Jira Projects', () => {
    it('Ensure jira project keys are always uppercase', async () => {
      var resp = await jira.getProjectIdByKey(key.toLowerCase())
      chai.assert.equal(resp, process.env.PROJECT_ID || projectId)
      core.set
    })

    it('Ensure project retrieval error message', async () => {
      var resp = await jira.getProjectIdByKey(badKey)
      chai.assert.equal(resp, `Error: No project could be found with key '${badKey.toUpperCase()}'.`)
    })

    it('Ensure project retrieval success', async () => {
      var resp = await jira.getProjectIdByKey(key)
      chai.assert.equal(resp, process.env.PROJECT_ID || projectId)
    })
  })

  context('Sync', () => {
    it('Ensure changelog parse omits branch references', async () => {
      parseChangelogForJiraTickets(changelog).forEach((ticket) => {
        chai.assert.notEqual(ticket, 'eslint')
      })
    })
  })
})
