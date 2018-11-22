'use strict';
/* eslint no-new: "off", no-unused-vars: "off" */
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const { GifFrame, GifUtil } = require('gifwrap');
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
        message: 'Which is the banner width?',
        default: '300'
      },
      {
        type: 'text',
        name: 'height',
        message: 'Which is the banner height?',
        default: '600'
      },
      {
        type: 'list',
        name: 'sdk',
        message: 'Which platform you want to use?',
        choices: ['standard', 'sizmek', 'doubleclick']
      },
      {
        type: 'list',
        name: 'type',
        message: 'Which type of banner you want to create?',
        choices: ['css animation', 'image jpeg', 'image gif']
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = props;
      this.props.type = this.props.type === 'css animation' ? 'css' : this.props.type;
      this.props.type = this.props.type === 'image jpeg' ? 'jpg' : this.props.type;
      this.props.type = this.props.type === 'image gif' ? 'gif' : this.props.type;
    });
  }

  writing() {
    this.props.width = Number(this.props.width);
    this.props.height = Number(this.props.height);
    const folder = `${this.props.width}x${this.props.height}`;
    this.fs.copy(this.templatePath(`banner`), this.destinationPath(folder));
    if (this.props.sdk !== 'standard') {
      this.fs.copy(
        this.templatePath(`anims.css`),
        this.destinationPath(`${folder}/lib/anims.css`)
      );
    }
    this.fs.copyTpl(
      this.templatePath(`${this.props.sdk}-${this.props.type}.html`),
      this.destinationPath(`${folder}/index.html`),
      {
        width: this.props.width,
        height: this.props.height
      }
    );
    /**
     * Img backup
     */
    new Jimp(this.props.width, this.props.height, 0x00000000, (err, image) => {
      if (!err) {
        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
          image.opaque();
          image.print(
            font,
            0,
            0,
            {
              text: folder,
              alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            this.props.width,
            this.props.height
          );
          if (this.props.type === 'gif') {
            let frame = new GifFrame(this.props.width, this.props.height, {
              delayCentisecs: 100
            });
            frame.bitmap = image.bitmap;
            GifUtil.write(`${folder}/default.gif`, [frame]);
          } else {
            image.quality(80);
            image.write(`${folder}/default.jpg`);
          }
        });
      }
    });
  }
};
