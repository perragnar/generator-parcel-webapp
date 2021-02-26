'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const slug = require('slug');
const glob = require('glob');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`${chalk.red('Parcel Web App')} generator!`)
    );

    // Initial prompt
    const initPrompt = [
      {
        type: 'input',
        name: 'appTitleInput',
        message: `Enter the ${chalk.blue('title')} of your web app.`,
        default: 'Parcel Web App'
      },
      {
        type: 'checkbox',
        name: 'options',
        message: `Initialize a ${chalk.blue('Git repository')}?`,
        choices: [
          {
            name: `Initialize a ${chalk.blue('Git repository')}`,
            value: 'initGit',
            checked: false
          },
          {
            name: `Open project in ${chalk.blue('Visual Studio Code')}?`,
            value: 'startVSCode',
            checked: false
          },
          {
            name: `Start ${chalk.blue('Parcel dev server')}?`,
            value: 'startDevServer',
            checked: true
          },
        ],
        store: true
      }
    ];

    return this.prompt(initPrompt).then(initAnswer => {
      this.props = {
        title: initAnswer.appTitleInput,
        appTitle: slug(initAnswer.appTitleInput, { lower: true }),
        options: initAnswer.options
      };
    });
  }

  default() {
  }

  writing() {
    this.log(`${chalk.green('Copying files.')}`);

    this.fs.copyTpl(
      glob.sync(this.templatePath('{/**/*,*,.*}'), { dot: true }),
      this.destinationPath(),
      // Template data
      {
        title: this.props.title,
        appTitle: this.props.appTitle
      }
    );
  }

  install() {
    // Installing dependencies
    this.log(`${chalk.green('Installing dependencies.')}`  );
    this.installDependencies({ bower: false });
  }

  end() {
    // Initialize git repository
    if (this.props.options.includes('initGit')) {
      this.log(`${chalk.green('Initializing Git repository.')}`);
      this.spawnCommand('git', ['init']);
    }

    // Start VSCode
    if (this.props.options.includes('startVSCode')) {
      this.log(`${chalk.green('Open project in Visual Studio Code.')}`);
      this.spawnCommand('code', ['.']);
    }

    // Start development server
    if (this.props.options.includes('startDevServer')) {
      this.log(`${chalk.green('Starting the dev server.')}`);
      this.spawnCommand('npm', ['run', 'dev']);
    }
  }
};
