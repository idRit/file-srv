const watch = require('node-watch');
const fs = require('fs');
const ftpHelper = require('./ftp.client');

watch(__dirname + '/up/', { recursive: true }, async function (evt, name) {
    console.log(name);
    console.log(evt);

    if (evt !== "remove") {
        let response = await ftpHelper.uploadFile(name.split('/up/')[1]);

        if (response) {
            console.log(name + " in ftp. Deleting now.");
            fs.unlink(__dirname + '/up/' + name.split('/up/')[1], (err) => {
                if (err) throw err;
                console.log('Deletion complete.');
            });
        }
    }
    
});