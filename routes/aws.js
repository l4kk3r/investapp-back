const express = require("express")
const router = express.Router()
require('dotenv/config')
const multer = require('multer')
const AWS = require('aws-sdk')
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const { AWS_ID, AWS_SECRET, AWS_BUCKET_NAME } = require('../secret');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: AWS_ID,
    secretAccessKey: AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function(req, res, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('file')

router.post('/aws/upload-image', upload, (req, res) => {
    imagemin.buffer(req.file.buffer, {
        plugins: [mozjpeg({ quality: 85 })]
    }).then(minified => {
        const file_name = uuidv4() + '.' + req.file.originalname.split('.')[1]
    
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: file_name,
            Body: minified
        }
    
        s3.upload(params, (error, data) => {
            if (error) {
                res.status(500).json({error})
            }
    
            res.status(200).json({url: data.Location})
        } )
    })
})

router.post('/aws/delete-file', (req, res) => {

    const {file_key} = req.body

    console.log(file_key)

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: file_key
    }

    s3.deleteObject(params, (error, data) => {
        if (error) {
            res.status(500).json({error})
        }

        res.status(200).json({data})
    })
})

router.post('/aws/upload-archive', upload, (req, res) => {
    const file_name = uuidv4() + '.' + req.file.originalname.split('.')[1]

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: file_name,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).json({error})
        }

        res.status(200).json({url: data.Location})
    } )
})


module.exports = router