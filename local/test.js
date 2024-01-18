const req = require('./req.body.json');

const { execZipFile } =  require('../helper/ossClient');

execZipFile(req.body);