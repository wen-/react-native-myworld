const Realm = require('realm');
const version = 1;

const m_saveNote = function (data,callback) {
    //定义表名及表结构
    const noteSchema = {
        name: 'note',
        primaryKey:'id',
        properties: {
            id: {type:'string',},
            changeTime: 'date?',
            title:  'string?',
            content: {type:'string',indexed: true}
        }
    };


    // ==多版本更新==
    // const schemas = [
    //     { schema: schema1, schemaVersion: 1, migration: migrationFunction1 },
    //     { schema: schema2, schemaVersion: 2, migration: migrationFunction2 },
    // ]
    // let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
    // while (nextSchemaIndex < schemas.length) {
    //     const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
    //     migratedRealm.close();
    // }
    //==end==

    Realm.open({
        schema: [noteSchema],
        schemaVersion: version,
        deleteRealmIfMigrationNeeded:true,//该属性开发使用，会删除之前建立的所有表，重新开始
        //单版本更新
        // migration: (oldRealm, newRealm) => {
        //     // 小于当前版本才执行
        //     if (oldRealm.schemaVersion < version) {
        //         const oldObjects = oldRealm.objects('note');
        //         const newObjects = newRealm.objects('note');
        //
        //         // 原数据新字段赋值
        //         for (let i = 0; i < oldObjects.length; i++) {
        //             newObjects[i].testall = oldObjects[i].title + ' ' + oldObjects[i].test;
        //         }
        //     }
        // }
    }).then(realm => {
        realm.write(() => {
            const note = realm.create('note', {
                id: data.id,
                changeTime: data.changeTime,
                title:  data.title||"",
                content: data.content
            });
            callback(note);
        });
    }).catch(error => {
        console.log(error);
    });
}

const m_updateNote = function (data,callback) {
    //定义表名及表结构
    const noteSchema = {
        name: 'note',
        primaryKey:'id',
        properties: {
            id: {type:'string',},
            changeTime: 'date?',
            title:  'string?',
            content: {type:'string',indexed: true},
        }
    };
    Realm.open({
        schema: [noteSchema]
    }).then(realm => {
        realm.write(() => {
            let teamDate = {};
            if(!data.id){
                console.log("m_updateNote：参数没有主键，更新失败");
                return false;
            }
            teamDate['id'] = data.id;
            data.changeTime && (teamDate['changeTime'] = data.changeTime);
            data.title && (teamDate['title'] = data.title);
            data.content && (teamDate['content'] = data.content);
            const note = realm.create('note', teamDate,true);
            callback(note);
        });
    }).catch(error => {
        console.log(error);
    });
}

const m_getNote = function (name, search) {
    const notes = realm.objects(name).filtered(search);
    return notes;
}

export {Realm,m_saveNote,m_getNote}