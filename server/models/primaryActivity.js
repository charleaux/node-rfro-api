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
            let options = {autoCommit: true};
            let result = await conn.execute(sql, binds, options);
            return binds;
        } catch (e) {
            throw new Error(e);
        }
    }
    static async findOneAndRemoveById({conn, id}) {
        try {
            let pa = await PrimaryActivity.findById({conn, id});
            if (!pa) {
                return new Error(`No Primary Activity Found with Id: ${id}`);
            }
            let sql = ` delete
                        from
                            primary_activities
                        where
                            id = :id`;
            let binds = {id};
            let options = {autoCommit: true};
            let result = await conn.execute(sql, binds, options)
            return pa;
        } catch (e) {
            throw new Error(e);
        }
    }
    static async findOneAndUpdateById({conn, id, name, department_id}) {
        try {
            let pa = await PrimaryActivity.findById({conn, id});
            if (!pa) {
                return new Error(`No Primary Activity Found with Id: ${id}`);
            }
            if (!name) {
                name = pa.name;
            }
            if (!department_id) {
                department_id = pa.department_id;
            }
            let sql = ` update primary_activities
                        set
                            name = :name,
                            department_id = :department_id
                        where
                            id = :id`;
            let binds = {id, name, department_id};
            let options = {autoCommit: true};
            let result = await conn.execute(sql, binds, options)
            pa = await PrimaryActivity.findById({conn, id});
            return pa;
        } catch (e) {
            throw new Error(e);
        }
    }
    static async findById({conn, id}) {
        try {
            let sql = ` select
                            id as "id",
                            name as "name",
                            department_id as "department_id"
                        from
                            primary_activities
                        where
                            id = :id`;
            let binds = {id};
            let options = {autoCommit: true};
            let result = await conn.execute(sql, binds, options)
            return {id: result.rows[0][0], name: result.rows[0][1], department_id: result.rows[0][2]}
        } catch (e) {
            throw new Error(e);
        }
    }
    static async findByDeptId({conn, department_id}) {
        try {
            let sql = ` select
                            id as "id",
                            name as "name",
                            department_id as "department_id"
                        from
                            primary_activities
                        where
                            department_id = :department_id`;
            let binds = {department_id};
            let options = {autoCommit: true};
            let result = await conn.execute(sql, binds, options)
            let output = [];
            
            result.rows.forEach(element => {
                output = output.concat({id: element[0], name: element[1], department_id: element[2]});
            });
            // console.log(result);
            // console.log(output);
            return output;
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