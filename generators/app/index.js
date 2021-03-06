'use strict';
/* eslint no-new: "off", no-unused-vars: "off", valid-jsdoc: "off" */
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const { GifFrame, GifUtil } = require('gifwrap');
const PSD = require('psd');
const pngToJpg = require('png-jpg');
const zfile = require('z-file');
const version = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../') + '/package.json')
).version;
module.exports = class extends Generator {
  prompting() {
    this.log(yosay('generator-z-banner ' + chalk.green(`v${version}`)));
    const prompts = [
      {
        type: 'list',
        name: 'psd',
        message: 'Create a banner from PSD file?',
        choices: ['Yes', 'No'],
        default: 'No'
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = props;
      const prompt = () => {
        const prompts = [
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
      };
      this.psd = false;
      if (this.props.psd === 'Yes') {
        this.psd = true;
        const prompts = [
          {
            type: 'text',
            name: 'filename',
            message: 'Filename:'
          }
        ];
        return this.prompt(prompts).then(props => {
          /**
           * Medidas a partir de PSD
           */
          this.psdFilename = props.filename;
          const psd = PSD.fromFile(this.psdFilename);
          psd.parse();
          this.width = psd.tree().export().document.width;
          this.height = psd.tree().export().document.height;
          return prompt();
        });
      }
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
        }
      ];
      return this.prompt(prompts).then(props => {
        this.width = Number(props.width);
        this.height = Number(props.height);
        return prompt();
      });
    });
  }

  writing() {
    this.props.width = this.width;
    this.props.height = this.height;
    const folder = `${this.props.width}x${this.props.height}`;
    this.fs.copyTpl(
      this.templatePath(`package.json`),
      this.destinationPath(`package.json`),
      {
        width: this.props.width,
        height: this.props.height
      }
    );
    this.fs.copy(this.templatePath(`.eslintrc.js`), this.destinationPath(`.eslintrc.js`));
    this.fs.copy(this.templatePath(`banner`), this.destinationPath(folder));
    if (this.props.type === 'css') {
      this.fs.copy(
        this.templatePath(`anims.css`),
        this.destinationPath(`${folder}/lib/anims.css`)
      );
      this.fs.copy(
        this.templatePath(`${this.props.sdk}-ad.js`),
        this.destinationPath(`${folder}/lib/ad.js`)
      );
      this.fs.copy(this.templatePath(`images`), this.destinationPath(`${folder}/images`));
    }
    this.fs.copyTpl(
      this.templatePath(`${this.props.sdk}-${this.props.type}.html`),
      this.destinationPath(`${folder}/index.html`),
      {
        width: this.props.width,
        height: this.props.height
      }
    );
    if (this.props.sdk === 'sizmek') {
      this.fs.copy(
        this.templatePath(`config.js`),
        this.destinationPath(`${folder}/config.js`)
      );
    }
    if (this.psd) {
      /**
       * PSD backup
       */
      zfile
        .psdToJpg(this.psdFilename, `${this.width}x${this.height}/default.jpg`, 40)
        .then(() => console.log('ok'))
        .catch(err => console.log(err));
    } else {
      /**
       * Dummy backup
       */
      const ext = this.props.type === 'gif' ? 'gif' : 'jpg';
      zfile.dummy(
        this.props.width,
        this.props.height,
        0x00000000,
        `${folder}/default.${ext}`
      );
      /**
       * Dummy Images
       */
      const createImage = (name, ext, text, color = 0x00000000) => {
        new Jimp(this.props.width, this.props.height, color, (err, image) => {
          if (!err) {
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
              if (ext === 'jpg') {
                image.opaque();
              }
              image.print(
                font,
                0,
                0,
                {
                  text: text,
                  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                  alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                },
                this.props.width,
                this.props.height
              );
              image.quality(80);
              image.write(`${folder}/images/${name}.${ext}`);
            });
          }
        });
      };
      if (this.props.type === 'css') {
        createImage('bg1', 'jpg', '', 0x00000000);
        createImage('bg2', 'jpg', '', 0xff220000);
        createImage('txt1', 'png', 'text1');
        createImage('txt2', 'png', 'text2');
        createImage('txt3', 'png', 'text3');
        createImage('txt4', 'png', 'text4');
      }
    }
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: false,
      yarn: true
    });
  }
};
