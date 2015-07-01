require('dotenv').load();
var AWS = require('aws-sdk');
var Promise = require('bluebird');
var mkdirp = require('mkdirp');
var fs = Promise.promisifyAll(require('fs'));
var archiver = require('archiver');

// AWS SDK Initialization
var s3 = new Promise.promisifyAll(new AWS.S3({
  accessKeyId: process.env.AWS_Access_Key_Id,
  secretAccessKey: process.env.AWS_Secret_Access_Key
}));

// Make sure we have a local debug folder
// mkdirp.sync('./debug/' + filePrefix + projectName + fileSuffix);

function getProjectFilesAsZip(projectName) {
  // 1. Given a project name "small", "medium", "large", find the files that match the prefix
  var bucketName = 'coding-challenges';

  var filePrefix = 'file_archiving/';
  projectName = projectName || 'small';
  var fileSuffix = '_project/';
  return s3.listObjectsAsync({Bucket: bucketName})
    .get('Contents')
    // .tap(console.log)
    .filter(function (file) {
      return file.Key.indexOf(filePrefix + projectName + fileSuffix) === 0;
    })
    // .tap(console.log)
    // 2. Download raw files from S3
    .map(function (file) {
      // var destination = fs.createWriteStream('./debug/' + file.Key);
      return {
        name: file.Key,
        stream: s3.getObject({Bucket: bucketName, Key: file.Key}).createReadStream()
      };
    })
    // // Debug the incoming stream to the console.
    // .tap(function (files) {
    //   files.forEach(function (file) {
    //     file.stream.on('data', function (data) {
    //       console.log(data);
    //     });
    //   });
    // })
    // 3. Pass raw files to zip library
    .then(function (files) {
      // var output = fs.createWriteStream(__dirname + '/example-output.zip');
      var archive = archiver('zip');
      files.forEach(function (file) {
        archive.append(file.stream, { name: file.name });
      });
      archive.finalize();
      return archive;
    });
}

module.exports = {
  getZip: getProjectFilesAsZip
};

// 4. Serve zip folder to user

