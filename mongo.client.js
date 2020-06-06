let connectToDB = async (app, uri) => {
    const mongoClient = require('mongodb').MongoClient;
    const client = await mongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('filemeta');
    console.log('Connected');
    require('./api.route')(app, db);
}

module.exports = connectToDB;