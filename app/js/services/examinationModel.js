angular.module('auxology').service('examinationModel', ['$q', 'sessionModel', 'lovefield', function ($q, sessionModel, lovefield) {

    return {
        createOrUpdate: function (patientId, examination) {
            return lovefield.getDB().then(function (db) {

                var examinationTable = db.getSchema().table('Examination');
                var doctorId = sessionModel.getCurrentUser().id;

                var examinationDb = {
                    doctorId: doctorId,
                    patientId: patientId,
                    length: examination.length,
                    description: examination.description,
                    headCircumference: examination.headCircumference,
                    weight: examination.weight,
                    dateTime: moment(examination.dateTime, "D. M. Y H:m").toDate()
                };

                var examinationRow = examinationTable.createRow(examinationDb);
                return db.insertOrReplace().into(examinationTable).values([examinationRow]).exec();

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
        },
        getAllByPatient: function (patientId) {
            return lovefield.getDB().then(function (db) {
                var examinationTable = db.getSchema().table('Examination');
                var doctorId = sessionModel.getCurrentUser().id;
                return db.select()
                    .from(examinationTable)
                    .where(
                        lf.op.and(
                            examinationTable.doctorId.eq(doctorId),
                            examinationTable.patientId.eq(patientId)
                        )
                    )
                    .orderBy(examinationTable.dateTime, lf.Order.DESC)
                    .exec();
            });
        }
    };

}]);