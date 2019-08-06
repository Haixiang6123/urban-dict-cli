#!/usr/bin/env node
const axios = require('axios')
const cheerio = require('cheerio')
const ora = require('ora')
const chalk = require('chalk')

const baseUrl = 'https://www.urbandictionary.com/define.php?term='
const DEFAULT_NUM = 1

// Validate arguments
if (!validate()) {
    return
}

// Get keyword
const keyword = process.argv[2]
// Get num
const num = process.argv[3] || DEFAULT_NUM

// Start loading
const spinner = ora(chalk.blue('Looking for ' + keyword + '...')).start();

// Send request
axios.get(`${baseUrl}${keyword}`).then(response => {
    // Stop loading
    spinner.stop()

    const html = response.data
    const DOM = cheerio.load(html)

    // Loop all panels
    DOM('.def-panel').each((index, element) => {
        if (index >= num) {
            return
        }

        const panelDOM = cheerio(element)

        // Meaning
        const meaning = panelDOM.find('.meaning').text()
        // Example
        const example = panelDOM.find('.example').text()

        printPanel(meaning, example)
    })
})

function printPanel(meaning, example) {
    console.log(chalk.red('################################'))
    console.log(chalk.blue('Meaning'))
    console.log(meaning)
    console.log(chalk.yellow('E.g.'))
    console.log(example)
    console.log(chalk.red('################################'))
}

function validate() {
    // Validate keyword
    if (process.argv.length !== 3 && process.argv.length !== 4) {
        console.log(`Usage: dict hello -> Look up hello`)
        console.log(`Usage: dict hello 5 -> Look up 5 results of 'hello'`)
        return false
    }
    return true
}