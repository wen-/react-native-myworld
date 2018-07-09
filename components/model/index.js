const Realm = require('realm');

const m_saveNote = function (data) {
    //定义表名及表结构
    const noteSchema = {
        name: 'note',
        properties: {
            time: 'date',
            title:  'string?',
            content: 'string',
        }
    };
    Realm.open({schema: [noteSchema]}).then(realm => {
        realm.write(() => {
            const myCar = realm.create('note', {
                time: data.time,
                title:  data.title||"",
                content: data.content,
            });
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