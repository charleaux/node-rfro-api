
const oracledb = require('oracledb');

const {dbPool, connect} = require('./db/dbConfig');
const {PrimaryActivity} = require('./models/primaryActivity');
const {Department} = require('./models/department');

async function init() {
    try {
        await oracledb.createPool(dbPool);
        let conn = await oracledb.getConnection();


        let deptTableDropped = await Department.dropTable({conn});
        let deptTableCreated = await Department.createTable({conn});
        let paTableDropped = await PrimaryActivity.dropTable({conn});
        let paTableCreated = await PrimaryActivity.createTable({conn});
    
        let dept1 = await new Department({name: 'Audit and Management Services'}).save({conn});
        console.log('Department1: ', dept1);

        let dept2 = await new Department({name: 'Information Technology'}).save({conn});
        console.log('Department2: ', dept2);
    
        let pa1 = await new PrimaryActivity({name: 'Administration', department_id: dept1.id}).save({conn});
        console.log('Primary Activity1:', pa1);
        let pa2 = await new PrimaryActivity({name: 'Audit Services', department_id: dept1.id}).save({conn});
        console.log('Primary Activity2:', pa2);
        let pa3 = await new PrimaryActivity({name: 'PA TO DELETE', department_id: dept1.id}).save({conn});
        console.log('Primary Activity3:', pa3);
        let pa4 = await new PrimaryActivity({name: 'PA TO UPDATE NAME', department_id: dept1.id}).save({conn});
        console.log('Primary Activity4:', pa4);
        let pa5 = await new PrimaryActivity({name: 'PA TO UPDATE DEPARTMENT', department_id: dept1.id}).save({conn});
        console.log('Primary Activity4:', pa5);

        let fpa1 = await PrimaryActivity.findById({conn, id: pa1.id});
        console.log(fpa1);
        
        let pas = await PrimaryActivity.findByDeptId({conn, department_id: dept1.id});
        console.log(`Primary Activities that belong to department '${dept1.name}':` , pas);

        console.log(`Deleting Primary Activity: ${pa3}`);
        let remPA3 = await PrimaryActivity.findOneAndRemoveById({conn, id: pa3.id});
        console.log(`Removed Primary Activity: `, remPA3);

        let newName = 'Some other PA Name';
        console.log(`Updating Primary Activity: ${JSON.stringify(pa4)} with a new name of: "${newName}"`)
        let updPA4 = await PrimaryActivity.findOneAndUpdateById({conn, id: pa4.id, name: newName})
        console.log(updPA4);

        console.log(`Updating Primary Activity: ${JSON.stringify(pa4)} with a new department of: "${JSON.stringify(dept2)}"`)
        let updPA5 = await PrimaryActivity.findOneAndUpdateById({conn, id: pa5.id, department_id: dept2.id})
        console.log(updPA5);

        await conn.close();
    
        console.log("end of init");
    } catch (e) {
        throw new Error(e);
    }

}


init();