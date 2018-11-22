'use strict';
/* eslint no-new: "off" */
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const version = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../') + '/package.json')
).version;
module.exports = class extends Generator {
  prompting() {
    this.log(yosay('generator-z-banner ' + chalk.green(`v${version}`)));
    const prompts = [
      {
        type: 'text',
        name: 'width',
        message: 'Which is the benner width?',
        default: '300'
      },
      {
        type: 'text',
        name: 'height',
        message: 'Which is the benner height?',
        default: '600'
      },
      {
        type: 'list',
        name: 'sdk',
        message: 'Which platform you want to use?',
        choices: ['standard', 'sizmek', 'doubleclick']
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const folder = `${this.props.width}x${this.props.height}`;
    this.fs.copy(this.templatePath(`banner`), this.destinationPath(folder));
    if (this.props.sdk !== 'standard') {
      this.fs.copy(
        this.templatePath(`anims.css`),
        this.destinationPath(`${folder}/lib/anims.css`)
      );
    }
    this.fs.copyTpl(
      this.templatePath(`${this.props.sdk}.html`),
      this.destinationPath(`${folder}/index.html`),
      {
        width: this.props.width,
        height: this.props.height
      }
    );
    new Jimp(this.props.width, this.props.height, 0x00000000, (err, image) => {
      if (!err) {
        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
          image
            .print(
              font,
              0,
              0,
              {
                text: folder,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
              },
              Number(this.props.width),
              Number(this.props.height)
            )
            .quality(80)
            .write(`${folder}/default.jpg`);
        });
      }
    });
  }
};
