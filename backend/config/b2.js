const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.B2_REGION,
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // สำคัญสำหรับ Backblaze B2
});

const storage = multerS3({
  s3: s3,
  acl: 'public-read',
  bucket: process.env.B2_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    cb(null, `fruitStore/${Date.now()}-${file.originalname}`);
  },
});

module.exports = { s3, storage };