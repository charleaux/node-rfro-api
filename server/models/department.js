const oracledb = require('oracledb');
const uuidv4 = require('uuid/v4');


class Department {
    constructor({name}) {
        this.id = uuidv4();
        this.name = name;
    }
    async save({conn}) {
        try {
            let sql = `insert into departments (id, name) values (:id, :name)`;
            let binds = {id: this.id, name: this.name};
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
                let result = await conn.execute(`drop table departments`);
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
                                             where UPPER(table_name) = UPPER('departments')`);
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
                    create table departments (
                        id CHAR(36) not null primary key,
                        name varchar(256)
                    ) `);
                return true;
            } else {
                return false;
            }

        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = {Department};