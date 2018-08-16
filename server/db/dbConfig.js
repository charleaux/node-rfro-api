require('../config/config');

const dbPool = {
    user:  process.env.dbPoolUser,
    password: process.env.dbPoolPassword,
    connectString: process.env.dbPoolConnectString,
    poolMin: parseInt(process.env.dbPoolPoolMin),
    poolMax: parseInt(process.env.dbPoolPoolMax),
    poolIncrement: parseInt(process.env.dbPoolPoolIncrement)
}

module.exports = {dbPool};

