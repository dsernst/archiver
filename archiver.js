require('dotenv').load();
var AWS = require('aws-sdk');
var Promise = require('bluebird');

// AWS SDK Initialization
var s3 = new Promise.promisifyAll(new AWS.S3({
  accessKeyId: process.env.AWS_Access_Key_Id,
  secretAccessKey: process.env.AWS_Secret_Access_Key
}));

var bucketName = 'coding-challenges';

var filePrefix = 'file_archiving/';
var projectName = 'small';
var fileSuffix = '_project/';

// 1. Given a project name "small", "medium", "large", find the files that match the prefix
s3.listObjectsAsync({Bucket: bucketName})
  .get('Contents')
  // .tap(console.log)
  .filter(function (file) {
    return file.Key.indexOf(filePrefix + projectName + fileSuffix) === 0;
  })
  // .tap(console.log)
  // 2. Download raw files from S3
  .map(function (file) {
    return s3.getSignedUrlAsync('getObject', {Bucket: bucketName, Key: file.Key})
  })
  .tap(console.log)

  // 3. Pass raw files to zip library
  // 4. Serve zip folder to user

