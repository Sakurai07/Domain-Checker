const Checker = require('./checker');
const keyword = process.argv.slice(2)[0];
const checker = new Checker({ keyword, saveAvailable: true });

checker.check();
