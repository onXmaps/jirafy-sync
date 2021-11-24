const core = require('@actions/core')
const { createVersionAndUpdateFixVersions } = require('./utils/jira')
var baseRef

async function run() {
  try {
    const changelog = core.getInput('changelog')
    const jiraVersion = core.getInput('jiraVersion')
    const regexp = /^[.A-Za-z0-9_-]*$/

    if (!changelog) {
      core.setFailed(
        'changelog property is required. Generate the changelog with github action coltdorsey/jirafy-changelog and reference the step output.'
      )
    }

    if (!jiraVersion) {
      core.setFailed(
        'jiraVersion property is required. Try setting the value to ${{ github.ref }}'
      )
    } else {
      baseRef = jiraVersion
      core.info(`baseRef set to jiraVersion input: ${jiraVersion}`)
    }

    if (!!baseRef && regexp.test(baseRef)) {
      await syncChangelogToJira()
    } else {
      core.setFailed(
        'Branch names must contain only numbers, strings, underscores, periods, and dashes.'
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function syncChangelogToJira() {
  try {
    const changelog = core.getInput('changelog')

    core.info(`fixVersion is: ${fixVersion}`)
    core.info(`changelog is: ${changelog}`)

    createVersionAndUpdateFixVersions(changelog, jiraVersion)
  } catch (err) {
    core.setFailed(
      `Could not create jira version(s) and / or update associated Jira tickets: ${err.message}`
    )
    process.exit(0)
  }
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
