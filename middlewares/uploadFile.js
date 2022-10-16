'use strict'

const Multer = require('utils/multer');

const mimeTypes = {
    'mp3': ['audio/mpeg']
}

const storeDestination = {
    'mp3': "/song"
}

module.exports = (fileType, fileSize, filePath) => {
        const uploader = new Multer(mimeTypes[fileType], fileSize, storeDestination[filePath]);
        return uploader.upload
}