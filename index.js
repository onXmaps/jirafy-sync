const core = require('@actions/core')
const github = require('@actions/github')
const { createVersionAndUpdateFixVersions } = require('./utils/jira')

async function run() {
  try {
    const myToken = core.getInput('myToken')
    const changelog = core.getInput('changelog')
    var baseRef = ''
    const octokit = new github.getOctokit(myToken)
    const { owner, repo } = github.context.repo
    const regexp = /^[.A-Za-z0-9_-]*$/

    if (!changelog) {
      core.setFailed(
        'No changelog provided. Reference output from coltdorsey/jirafy-changelog@1.0.0',
      )
    }

    if (!baseRef) {
      const latestRelease = await octokit.rest.repos.getLatestRelease({
        owner: owner,
        repo: repo,
      })

      if (latestRelease) {
        baseRef = latestRelease.data.tag_name
      } else {
        baseRef = core.getInput('jiraVersion')
      }
    }

    if (!!baseRef && regexp.test(baseRef)) {
      syncChangelogToJira()
    } else {
      core.setFailed(
        'Branch names must contain only numbers, strings, underscores, periods, and dashes.',
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function syncChangelogToJira() {
  try {
    const fixVersion = baseRef
    const changelog = core.getInput('changelog')

    core.info(`fixVersion is: ${fixVersion}`)
    core.info(`changelog is: ${changelog}`)

    createVersionAndUpdateFixVersions(changelog, fixVersion)
  } catch (err) {
    core.setFailed(
      `Could not create jira version(s) and / or update associated Jira tickets: ${err.message}`,
    )
    process.exit(0)
  }
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
