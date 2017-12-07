#!/usr/bin/env node
const inquirer = require('inquirer');
const program = require('commander');
const { make } = require('./logics');

program
    .version('0.0.1')
    .description('Core management system')

;

program
    .command('make')
    .description('Make a request action with saga')
    .action(() => {
        const questions = [
            {
                type: 'input',
                name: 'feature',
                message: "What's feature?",
            },
            {
                type: 'input',
                name: 'name',
                message: 'What is action name?',
            },
            {
                type: 'list',
                name: 'type',
                message: 'What type of action do you need?',
                choices: ['request', 'submit', 'paginate'],
            },
            {
                type: 'confirm',
                name: 'saga',
                message: 'Do you need saga ?',
                default: false
            },
            {
                type: 'input',
                name: 'withSaga',
                message: 'Typing a filename of saga function (no need ".js")',
                when: function(answers) {
                    return answers.saga;
                }
            },
            {
                type: 'confirm',
                name: 'reducer',
                message: 'Do you need reducer ?',
                default: false,
                when: function(answers) {
                    return answers.saga;
                }
            },
            {
                type: 'input',
                name: 'withReducer',
                message: 'Typing a state key name',
                when: function(answers) {
                    return answers.reducer;
                }
            },
        ];

        inquirer.prompt(questions).then(make);
    })
;

program.parse(process.argv);
