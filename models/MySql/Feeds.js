const db = require("../../config/database")
const tableName = "feed";

const getFeeds = async () => {
    const query = `SELECT * FROM '${tableName}' ORDER BY updatedAt DESC`

    try {
        const feeds = await db.query(query);
        return feeds;
    } catch (error) {
        console.error("Models.GetFeeds Error", error)
    }
}


module.exports = {
    getFeeds
}