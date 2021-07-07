(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var fs = require('fs');

  var my = require('../src/my.js');

  var capemgr = my.is_capemgr();
  var slots = await fs_readFilePromise(capemgr + '/slots', 'ascii');
  console.log(slots);
  var slot = slots.match(/^\s*\d+\s*:.*,bs.*P8_13/gm);
  console.log(slot);
  slot = slots.match(/\d+(?=\s*:.*,bs.*P8_13)/gm);
  console.log(slot);
})();