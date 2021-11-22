const core = require('@actions/core')
const packageName = require('../package.json').name
const jiraHost = core.getInput('jiraHost') || process.env.JIRA_HOST

/**
 * Parses a given changelog for Jira tickets
 * @param {String} changelog
 * @returns {Array} Jira story(ies) parsed from the changelog. Removes duplicates.
 */
function parseChangelogForJiraTickets(changelog) {
  var tickets

  try {
    const regex = /([A-Za-z0-9]+-\d+)/g
    tickets = [...changelog.matchAll(regex)]
  } catch (error) {
    core.setFailed(error.message)
  }

  const duplicates = tickets.map((m) => m[0])

  return [...new Set(duplicates)]
}

/**
 * Parses a given string for a word
 * @param {Array} arr Array or string to parse
 * @returns {Array} Parsed word(s)
 */
function parseForWord(arr) {
  const regex = /\b[^\d\W]+\b/gm
  var parsedWords = []
  while ((m = regex.exec(arr)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    m.map((story) => {
      parsedWords.push(story)
    })
  }
  return parsedWords
}

/**
 * Parses a given string for a version
 * @param {String} version String to be parsed for version
 * @returns {String} Parsed version
 */
function parseForVersion(version) {
  try {
    const regex = /v\d+.\d+.\d+/g
    version = [...version.matchAll(regex)]
  } catch (error) {
    core.setFailed(error.message)
  }

  return version.map((m) => m[0])[0]
}

/**
 * Returns today's date
 * @returns {String} Todays date in yyyy-mm-dd format
 */
function today() {
  return new Date().toISOString().slice(0, 10)
}

module.exports = {
  jiraHost,
  parseChangelogForJiraTickets,
  parseForWord,
  parseForVersion,
  today,
  packageName,
}
