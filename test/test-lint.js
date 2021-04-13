(async function () {
  const fs_statPromise = require('util').promisify(require('fs').stat);

  const fs_readdirPromise = require('util').promisify(require('fs').readdir);

  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  module.exports = {};

  var beautify = require('../node_modules/js-beautify');

  var fs = require('fs');

  var path = require('path');

  var config = JSON.parse(await fs_readFilePromise('./lint-config.json'));
  var index = 0;
  await testDir("./");
  await testDir("./src/");
  await testDir("./test/");

  async function testDir(dir) {
    var files = await fs_readdirPromise(dir);

    for (const [index, file] of files.entries()) {
      await testFile(dir + file);
    }
  }

  async function testFile(fileToTest) {
    var stat = await fs_statPromise(fileToTest);

    if (stat.isFile() && fileToTest.match(/js$/)) {
      //console.log("Adding lint test for " + fileToTest);
      index++;

      module.exports["testLint" + index] = function (test) {
        var inFile = "a";
        var outFile = "b";
        test.expect(2);
        test.doesNotThrow(function () {
          console.log("Running lint on " + fileToTest);
          inFile = fs.readFileSync(fileToTest, 'utf8');
          outFile = beautify.js(inFile, config); //fs.writeFileSync(fileToTest + ".lint", outFile);
        });
        test.equal(inFile, outFile);
        test.done();
      };
    }
  }
})();