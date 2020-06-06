module.exports = (app, db) => {
    const multer = require('multer');
    const upload = multer({ dest: "up" });
    const fileDataCollection = db.collection('metadata');
    const ftpHelper = require('./ftp.client');
    const fs = require('fs');

    app.post('/api/uploadFile', upload.single('mFile'), async (req, res) => {
        // save details
        fileDataCollection.insertOne({
            user: req.body.user,
            originalFileName: req.file.originalname,
            size: req.file.size,
            filename: req.file.filename
        });

        return res.json({
            response: "saved",
            file: req.file
        });
    });

    app.get('/download/:id', async (req, res) => {
        let result = await fileDataCollection.findOne({ filename: req.params.id });

        if (!result) {
            return res.json({
                data: "no data found"
            });
        }

        if (!fs.existsSync(__dirname + '/dl/' + result.originalFileName)) {
            let response = await ftpHelper.downloadFile(req.params.id);
            if (response) {
                fs.renameSync(__dirname + '/dl/' + req.params.id, __dirname + '/dl/' + result.originalFileName);
            }
        }

        res.download(`${__dirname}/dl/${result.originalFileName}`);

        setTimeout(() => {
            if (fs.existsSync(__dirname + '/dl/' + result.originalFileName)) {
                fs.unlink(__dirname + '/dl/' + result.originalFileName, (err) => {
                    if (err) throw err;
                    console.log('Deletion complete.');
                });
            }
        }, 10000);
    });

    app.get('/api/allDownloadLinks/:user', async (req, res) => {
        let result = await fileDataCollection.find({ user: req.params.user }).toArray();
        if (result.length == 0) {
            return res.json({
                data: 0
            });
        }

        let links = [];

        result.forEach(el => {
            links.push({
                sizeInBytes: el.size,
                fileName: el.originalFileName,
                link: 'http://localhost:3000/download/' + el.filename,
                id: el.filename
            });
        });

        return res.json(links);
    });

    app.get('/api/deleteFile/:id', async (req, res) => {
        let result = await fileDataCollection.findOne({ filename: req.params.id });

        if (!result) {
            return res.json({
                data: "no data found"
            });
        }

        fileDataCollection.deleteOne({ filename: req.params.id });
        let res = await ftpHelper.deleteFile(req.params.id);

        return res.json({
            success: true,
            fileDeleted: result.originalFileName
        });
    });
}