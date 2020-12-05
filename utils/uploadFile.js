const {Storage} = require('@google-cloud/storage')
const path = require('path')


const storage = new Storage({
  projectId: "shareyourfy",
  keyFilename: "./config/serviceAccountKey.json"
});

const bucket = storage.bucket("gs://shareyourfy.appspot.com");

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname.split(/\s/).join('')}_${Date.now()}${path.extname(file.originalname)}`;

    let fileUpload = bucket.file("EDimages/" + newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
        console.log(error)
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/shareyourfy.appspot.com/o/EDimages%2F${newFileName}?alt=media`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
}

exports.FirebaseUpload = uploadImageToStorage