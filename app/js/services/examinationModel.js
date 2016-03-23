angular.module('auxology').service('examinationModel', ['$q', 'sessionModel', 'lovefield', function ($q, sessionModel, lovefield) {

    return {
        createOrUpdate: function () {

            return lovefield.getDB().then(function (db) {

            });

        },
        latest: function () {
            return lovefield.getDB().then(function (db) {
                var examinationTable = db.getSchema().table('Examination');
                var doctorId = sessionModel.getCurrentUser().id;
                return db.select()
                    .from(examinationTable)
                    .where(examinationTable.doctorId.eq(doctorId))
                    .orderBy(examinationTable.dateTime, lf.Order.DESC)
                    .limit(1)
                    .exec();
            });
        }
    };

}]);