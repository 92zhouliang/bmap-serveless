const req = require('./req.body.json');

const { execZipFile } =  require('../helper/ossClient');

try {
    execZipFile(req.body);
} catch (error) {
    console.log(error)
}