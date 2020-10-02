#!/usr/bin/env node

// index.js
const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const ora = require('ora');
const downloadGit = require('download-git-repo');

const TEMPLATE_NAME = 'Z-Uni-Template';

const REPO_URL = 'zwl4488/z-uni-template';

// 获取项目信息
const getProject = () => {
  const questions = [
    {
      name: 'projectName',
      type: 'input',
      message: '请输入项目名称：',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return '请输入项目名称：';
        }
      }
    }
  ];

  return inquirer.prompt(questions);
};

// 创建目录
// const createDir = name => {
//   fs.mkdirSync(name);
// }

// 判断目录是否存在
const directoryExists = filePath => {
  return fs.existsSync(filePath);
}

// 下载项目模板
const downloadRepo = projectName => {
  return new Promise((resolve, reject) => {
    //projectName 为下载到的本地目录
    downloadGit(REPO_URL, projectName,
      err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
};

const run = async () => {
  const projectName = (await getProject()).projectName;

  if (directoryExists(projectName)) {
    console.log(chalk.red('目标目录已存在，请重新输入'));

    run();
  }
  else {
    const spinner = ora(`加载项目模板中...\n`);

    spinner.start();

    await downloadRepo(projectName).catch(err => {
      spinner.stop();

      console.log(chalk.red(err));
    });

    spinner.stop();

    console.log(chalk.green('项目创建成功！'));
  }
};

clear();

// welcome banner
console.log(chalk.green(figlet.textSync(TEMPLATE_NAME, { horizontalLayout: 'full' })));

run();
