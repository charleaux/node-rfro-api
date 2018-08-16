const oracledb = require('oracledb');
const uuidv4 = require('uuid/v4');


class PrimaryActivity {
    constructor({name, department_id}) {
        this.id = uuidv4();
        this.name = name;
        this.department_id = department_id;
    }
    async save({conn}) {
        try {
            let sql = `insert into primary_activities (id, name, department_id) values (:id, :name, :department_id)`;
            let binds = {id: this.id, name: this.name, department_id: this.department_id};
            let options = {autoCommit: true}
            let result = await conn.execute(sql, binds, options);
            return binds;
        } catch (e) {
            throw new Error(e);
        }
    }
    static async dropTable({conn}) {
        try {
            let tableExists = await this.tableExists({conn});
            if (tableExists === true) {
                let result = await conn.execute(`drop table primary_activities`);
                // console.log(JSON.stringify(result, undefined, 2));
                return true;
            } else {
                return false;
            }

        } catch (e) {
            throw new Error(e);
        }
    }
    static async tableExists({conn}) {
        try {
            let result = await conn.execute(`select count(*) as "count"
                                             from user_tables
                                             where UPPER(table_name) = UPPER('primary_activities')`);
            let count = result.rows[0][0];
            if (count === 0) {
                return false;
            }
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
    static async createTable({conn}) {
        try {
            let tableExists = await this.tableExists({conn});
            if (tableExists === false) {
                let result = await conn.execute(`
                    create table primary_activities (
                        id CHAR(36) not null primary key,
                        name varchar(256),
                        department_id CHAR(36)
                    ) `);
                // console.log(JSON.stringify(result, undefined, 2));
                return true;
            } else {
                return false;
            }

        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = {PrimaryActivity};