require('dotenv').config()

const ftp = require('basic-ftp');
const jsftp = require("jsftp");

const ftpBase = "/home/ritwikm/Documents/projects/staas/storage/";

const uploadBuffer = __dirname + "/up/";
const downloadBuffer = __dirname + "/dl/";

const config = {
    host: "127.0.0.1",
    user: "ritwikm",
    password: "ftp_pass",
    secure: false
}

async function deleteFile(id) {
    const FTP = new jsftp(config);
    FTP.raw("dele", ftpBase + id, (err, data) => {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    });
}

async function downloadFile(id) {
    const client = new ftp.Client()
    try {
        await client.access(config)
        //console.log(await client.list())
        await client.downloadTo(`${downloadBuffer}/${id}`, `${ftpBase}/${id}`);
    }
    catch (err) {
        client.close()
        console.log(err)
        return false;
    }
    client.close()

    return true;
}

async function uploadFile(file) {
    //console.log(config.password);
    const client = new ftp.Client();
    try {
        await client.access(config)
        //buffer to user
        await client.uploadFrom(`${uploadBuffer}/${file}`, `${ftpBase}/${file}`)
    } catch (error) {
        client.close();
        console.log(error)
        return false;
    }
    client.close();

    return true;
}

module.exports = {
    downloadFile, uploadFile, deleteFile
}