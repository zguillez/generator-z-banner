'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-z-banner:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      width: '300',
      height: '600',
      sdk: 'standard',
      type: 'image jpeg'
    });
  });

  it('creates files', () => {
    assert.file(['300x600/index.html']);
  });
});
