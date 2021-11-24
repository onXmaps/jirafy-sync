const core = require('@actions/core')
const { createVersionAndUpdateFixVersions } = require('./utils/jira')
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
        'jiraVersion property is required. Try setting the value to ${{ github.event.release.tag_name }}'
      )
    }

    if (!!jiraVersion && regexp.test(jiraVersion)) {
      await syncChangelogToJira(changelog, jiraVersion)
    } else {
      core.setFailed(
        'Branch names must contain only numbers, strings, underscores, periods, and dashes.'
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function syncChangelogToJira(changelog, jiraVersion) {
  try {
    core.info(`fixVersion is: ${fixVersion}`)
    core.info(`changelog is: ${changelog}`)

    createVersionAndUpdateFixVersions(changelog, jiraVersion)
  } catch (err) {
    core.setFailed(`Jirafy Sync failed: ${err.message}`)
    process.exit(0)
  }
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
