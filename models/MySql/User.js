const db = require("../../config/database")


const dbName = "users"

// Get all users
const getUsers = async () => {
  const query = `SELECT * FROM '${dbName}' ORDER BY updatedAt DESC`;

  try {
     const users = await db.query(query);
     return users;
   } catch (e) {
     console.log(e);
   }
}

// Geting User by Id
const getUser = (userId) => {

}


const createUser = () => {}
const updateUser = () => {}
const deleteUser = () => {}

const login = () => {}
const logout = () => {}


module.exports = {
  getUsers
}