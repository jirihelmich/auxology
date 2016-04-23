angular.module('auxology').service('examinationModel', ['$q', 'sessionModel', 'lovefield', function ($q, sessionModel, lovefield) {

    function numerize(string) {
        var number = string;
        if (!number) {
            return NaN;
        }
        if (number.replace) {
            number = number.replace(/[^\d]*(\d+)[,\.]?(\d)?.*/g, "$1$2");
        }
        return parseInt(number);
    }

    return {
        createOrUpdate: function (patientId, examination) {
            return lovefield.getDB().then(function (db) {

                var examinationTable = db.getSchema().table('Examination');
                var doctorId = sessionModel.getCurrentUser().id;

                var examinationDb = {
                    id: examination.id,
                    doctorId: doctorId,
                    patientId: patientId,
                    length: numerize(examination.length),
                    description: examination.description,
                    headCircumference: numerize(examination.headCircumference),
                    weight: numerize(examination.weight),
                    dateTime: moment(examination.dateTime, "D. M. Y H:m").toDate()
                };

                var examinationRow = examinationTable.createRow(examinationDb);
                return db.insertOrReplace().into(examinationTable).values([examinationRow]).exec();
            });
        },
        getById: function (id) {
            return lovefield.getDB().then(function (db) {
                var examinationTable = db.getSchema().table('Examination');
                var doctorId = sessionModel.getCurrentUser().id;
                return db.select()
                    .from(examinationTable)
                    .where(
                        lf.op.and(
                            examinationTable.doctorId.eq(doctorId),
                            examinationTable.id.eq(id)
                        )
                    )
                    .limit(1)
                    .exec();
            });
        },
        deleteById: function (id) {
            return lovefield.getDB().then(function (db) {
                var examinationTable = db.getSchema().table('Examination');
                var doctorId = sessionModel.getCurrentUser().id;

                return db.delete().from(examinationTable).where(
                    lf.op.and(
                        examinationTable.doctorId.eq(doctorId),
                        examinationTable.id.eq(id)
                    )
                ).exec();
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