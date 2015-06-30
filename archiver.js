// Given a project name "small", "medium", "large"

require('dotenv').load();
var AWS = require('aws-sdk');
console.log(AWS);

// AWS SDK Initialization
var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_Access_Key_Id,
  secretAccessKey: process.env.AWS_Secret_Access_Key
});

console.log(s3);

// 1. Find files that match the prefix
// 2. Download raw files from S3
// 3. Pass raw files to zip library
// 4. Serve zip folder to user

