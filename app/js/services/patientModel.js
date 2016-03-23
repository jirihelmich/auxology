angular.module('auxology').service('patientModel', ['$q', 'sessionModel', 'lovefield', function ($q, sessionModel, lovefield) {

    function getPerson(mixedData) {
        return {
            id: mixedData.id,
            birthNumber: (mixedData.birthNumber || "").replace('/', '').replace(' ', ''),
            gender: mixedData.gender,
            titlePrefix: mixedData.titlePrefix,
            titlePostfix: mixedData.titlePostfix,
            firstName: mixedData.firstname,
            lastName: mixedData.lastname,
            firstNameSearchable: url_slug(mixedData.firstname || "").toLowerCase(),
            lastNameSearchable: url_slug(mixedData.lastname || "").toLowerCase(),
            email: mixedData.email,
            phone: mixedData.phone,
            weight: mixedData.weight,
            length: mixedData.length,
            headCircumference: mixedData.headCircumference
        };
    }

    function getPatient(mixedData) {
        return {
            isActive: mixedData.isActive === undefined || mixedData.isActive === null ? true : isActive,
            birthWeek: mixedData.birthWeek,
            birthWeight: mixedData.birthWeight,
            birthLength: mixedData.birthLength,
            birthHeadCircumference: mixedData.birthHeadCircumference
        };
    }

    var motherId, fatherId;

    function getPersistor(db) {
        return function (p) {

            var addressTable = db.getSchema().table('Address');
            var addressRow = addressTable.createRow(p.address);
            var addressPromise = db.insertOrReplace().into(addressTable).values([addressRow]).exec();

            var personPromise = addressPromise.then(function (addresses) {
                var personTable = db.getSchema().table('Person');
                p.person.addressId = addresses[0].id;
                var personRow = personTable.createRow(p.person);
                return db.insertOrReplace().into(personTable).values([personRow]).exec();
            });

            if (!p.patient) {
                return personPromise.then(function (persons) {
                    var id = persons[0].id;
                    if (p.mother) {
                        motherId = id;
                    }
                    if (p.father) {
                        fatherId = id;
                    }
                    return persons;
                });
            }

            return personPromise.then(function (persons) {
                var patientTable = db.getSchema().table('Patient');
                p.patient.personId = persons[0].id;
                p.patient.motherId = motherId;
                p.patient.fatherId = fatherId;
                p.patient.doctorId = sessionModel.getCurrentUser().id;
                var patientRow = patientTable.createRow(p.patient);
                return db.insertOrReplace().into(patientTable).values([patientRow]).exec();
            });

        }
    }

    return {
        createOrUpdate: function (patient, mother, father) {

            var parents = [
                {
                    address: mother.address,
                    person: getPerson(mother),
                    mother: true
                },
                {
                    address: father.address,
                    person: getPerson(father),
                    father: true
                }
            ];

            var kid = {
                address: patient.address,
                person: getPerson(patient),
                patient: getPatient(patient)
            };

            return lovefield.getDB().then(function (db) {
                var persistor = getPersistor(db);

                var parentsPromise = $q.all(parents.map(persistor));

                return parentsPromise.then(function () {
                    return persistor(kid);
                });

            });

        },
        getById: function (id) {
            return lovefield.getDB().then(function (db) {
                var patientTable = db.getSchema().table('Patient');
                var personTable = db.getSchema().table('Person');
                var examinationTable = db.getSchema().table('Examination');

                var doctorId = sessionModel.getCurrentUser().id;
                return db.select()
                    .from(patientTable)
                    .innerJoin(personTable, personTable.id.eq(patientTable.personId))
                    .leftOuterJoin(examinationTable, examinationTable.patientId.eq(patientTable.id))
                    .where(
                        lf.op.and(
                            patientTable.doctorId.eq(doctorId),
                            patientTable.id.eq(id)
                        )
                    )
                    .exec();
            });
        },
        search: function (token, count) {

            return lovefield.getDB().then(function (db) {
                var patientTable = db.getSchema().table('Patient');
                var personTable = db.getSchema().table('Person');

                var tokens = token.split(" ");
                var ors = tokens.map(function (token) {
                    token = url_slug(token);
                    return lf.op.or(
                        personTable.lastNameSearchable.match(token),
                        personTable.firstNameSearchable.match(token),
                        personTable.birthNumber.match(token)
                    );
                });

                var orsForAnd = lf.op.or.apply(this, ors);

                var doctorId = sessionModel.getCurrentUser().id;
                return db.select()
                    .from(patientTable)
                    .innerJoin(personTable, personTable.id.eq(patientTable.personId))
                    .where(
                        lf.op.and(
                            patientTable.doctorId.eq(doctorId),
                            orsForAnd
                        )
                    )
                    .orderBy(patientTable.id, lf.Order.DESC)
                    .limit(count)
                    .exec();
            });
        },
        recent: function (count) {
            return lovefield.getDB().then(function (db) {
                var patientTable = db.getSchema().table('Patient');
                var personTable = db.getSchema().table('Person');

                var doctorId = sessionModel.getCurrentUser().id;
                return db.select()
                    .from(patientTable)
                    .innerJoin(personTable, personTable.id.eq(patientTable.personId))
                    .where(patientTable.doctorId.eq(doctorId))
                    .orderBy(patientTable.id, lf.Order.DESC)
                    .limit(count)
                    .exec();
            });
        }
    };

}]);