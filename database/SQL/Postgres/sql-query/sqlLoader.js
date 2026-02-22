const fs = require('fs');
const path = require('path');

function loadSql(relativePath) {
  const filePath = path.join(__dirname, relativePath);
  return fs.readFileSync(filePath, 'utf8');
}

module.exports = { loadSql };