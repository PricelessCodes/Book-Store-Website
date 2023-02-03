const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
    "mongodb+srv://yahia:klBaU456OD9NHraM@cluster0.tx4rcfc.mongodb.net/shop?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
let _db;
const mongoConnect = (callback) => {
    client
        .connect()
        .then((result) => {
            console.log("result at connect" + client);
            _db = result.db();
            console.log("result at connect" + _db);
            callback();
        })
        .catch((err) => {
            console.log("error at connect catch" + err);
            throw err;
        });
};

const getDb = () => {
    if (_db) return _db;

    throw "No Database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.ObjectId = ObjectId;
