angular.module('auxology').service('personModel', ['$q', 'sessionModel', 'lovefield', function ($q, sessionModel, lovefield) {

    return {
        getCurrentDoctor: function () {
            return lovefield.getDB().then(function (db) {
                var personTable = db.getSchema().table('Person');
                var doctorId = sessionModel.getCurrentUser().id;

                return db.select()
                    .from(personTable)
                    .where(personTable.id.eq(doctorId))
                    .exec();
            });
        },
        update: function (person) {
            return lovefield.getDB().then(function (db) {
                var personTable = db.getSchema().table('Person');
                var personRow = personTable.createRow(person);
                return db.insertOrReplace().into(personTable).values([personRow]).exec();
            });
        }
    };

}]);