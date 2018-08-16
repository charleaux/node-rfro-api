
const oracledb = require('oracledb');

const {dbPool} = require('./db/dbConfig');
const {PrimaryActivity} = require('./models/primaryActivity');
const {Department} = require('./models/department');

async function init() {
    try {
        let pool = await oracledb.createPool(dbPool);
        let conn = await oracledb.getConnection();
        // console.log(dbPool);
        // let conn = await oracledb.getConnection();
        // let result = await conn.execute(`SELECT 'Charles' AS "first_name", 'Torry' as "last_name" from DUAL`);
        // console.log(result);
        // let modelExists = await PrimaryActivity.tableExists();
        // if (modelExists === false) {
        //     await PrimaryActivity.createTable();
        // }
        let deptTableDropped = await Department.dropTable({conn});
        let deptTableCreated = await Department.createTable({conn});
        let paTableDropped = await PrimaryActivity.dropTable({conn});
        let paTableCreated = await PrimaryActivity.createTable({conn});
    
        let dept1 = await new Department({name: 'Audit and Management Services'}).save({conn});
        console.log('Department1: ', dept1);
    
        let pa1 = await new PrimaryActivity({name: 'Administration', department_id: dept1.id}).save({conn});
        console.log('Primary Activity1:', pa1);
        let pa2 = await new PrimaryActivity({name: 'Audit Services', department_id: dept1.id}).save({conn});
        console.log('Primary Activity2:', pa2);
    
        await conn.close();
    
        console.log("end of init");
    } catch (e) {
        throw new Error(e);
    }

}


init();
console.log("init run");