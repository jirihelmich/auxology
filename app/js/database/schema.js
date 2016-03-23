function dbSchema(lovefieldProvider) {

    var schemaBuilder = lovefieldProvider.create('auxology', 14);

    schemaBuilder.createTable('Address')
        .addColumn('id', lf.Type.INTEGER)
        .addColumn('street', lf.Type.STRING)
        .addColumn('city', lf.Type.STRING)
        .addColumn('country', lf.Type.STRING)
        .addNullable(['street', 'city', 'country'])
        .addPrimaryKey(['id'], true);

    schemaBuilder.createTable('Person')
        .addColumn('id', lf.Type.INTEGER)
        .addColumn('gender', lf.Type.STRING)
        .addColumn('titlePrefix', lf.Type.STRING)
        .addColumn('firstName', lf.Type.STRING)
        .addColumn('lastName', lf.Type.STRING)
        .addColumn('firstNameSearchable', lf.Type.STRING)
        .addColumn('lastNameSearchable', lf.Type.STRING)
        .addColumn('titlePostfix', lf.Type.STRING)
        .addColumn('email', lf.Type.STRING)
        .addColumn('phone', lf.Type.STRING)
        .addColumn('birthNumber', lf.Type.STRING)
        .addColumn('addressId', lf.Type.INTEGER)
        .addColumn('weight', lf.Type.INTEGER)
        .addColumn('length', lf.Type.INTEGER)
        .addColumn('headCircumference', lf.Type.INTEGER)
        .addNullable([
            'gender',
            'titlePrefix',
            'firstName',
            'lastName',
            'firstName',
            'lastNameSearchable',
            'firstNameSearchable',
            'lastName',
            'titlePostfix',
            'email',
            'phone',
            'birthNumber',
            'weight',
            'length',
            'headCircumference'
        ])
        .addPrimaryKey(['id'], true)
        .addForeignKey('fkAddressId', {
            local: 'addressId',
            ref: 'Address.id',
            action: lf.ConstraintAction.CASCADE
        })
        .addIndex('idxBirthNumber', ['birthNumber'])
        .addIndex('idxAddressId', ['addressId']);

    schemaBuilder.createTable('User')
        .addColumn('id', lf.Type.INTEGER)
        .addColumn('personId', lf.Type.INTEGER)
        .addColumn('username', lf.Type.STRING)
        .addColumn('password', lf.Type.STRING)
        .addPrimaryKey(['id'], true)
        .addIndex('idxUsernamePassword', ['username', 'password'])
        .addForeignKey('fkPersonId', {
            local: 'personId',
            ref: 'Person.id',
            action: lf.ConstraintAction.CASCADE
        })
        .addIndex('idxPersonId', ['personId']);

    schemaBuilder.createTable('Patient')
        .addColumn('id', lf.Type.INTEGER)
        .addColumn('personId', lf.Type.INTEGER)
        .addColumn('doctorId', lf.Type.INTEGER)
        .addColumn('motherId', lf.Type.INTEGER)
        .addColumn('fatherId', lf.Type.INTEGER)
        .addColumn('isActive', lf.Type.BOOLEAN)
        .addColumn('birthWeek', lf.Type.INTEGER)
        .addColumn('birthWeight', lf.Type.INTEGER)
        .addColumn('birthLength', lf.Type.INTEGER)
        .addColumn('birthHeadCircumference', lf.Type.INTEGER)
        .addPrimaryKey(['id'], true)
        .addForeignKey('fkPersonId', {
            local: 'personId',
            ref: 'Person.id',
            action: lf.ConstraintAction.CASCADE
        })
        .addForeignKey('fkDoctorId', {
            local: 'doctorId',
            ref: 'User.id',
            action: lf.ConstraintAction.RESTRICT
        })
        .addForeignKey('fkMotherId', {
            local: 'motherId',
            ref: 'Person.id',
            action: lf.ConstraintAction.CASCADE
        })
        .addForeignKey('fkFatherId', {
            local: 'fatherId',
            ref: 'Person.id',
            action: lf.ConstraintAction.CASCADE
        })
        .addNullable(['birthLength', 'birthHeadCircumference'])
        .addIndex('idxPersonId', ['personId'])
        .addIndex('idxDoctorId', ['doctorId']);

    schemaBuilder.createTable('Examination')
        .addColumn('id', lf.Type.INTEGER)
        .addColumn('patientId', lf.Type.INTEGER)
        .addColumn('doctorId', lf.Type.INTEGER)
        .addColumn('dateTime', lf.Type.DATE_TIME)
        .addColumn('weight', lf.Type.INTEGER)
        .addColumn('height', lf.Type.INTEGER)
        .addColumn('headCircumference', lf.Type.INTEGER)
        .addColumn('description', lf.Type.STRING)
        .addPrimaryKey(['id'], true)
        .addForeignKey('fkPatientId', {
            local: 'patientId',
            ref: 'Patient.id',
            action: lf.ConstraintAction.CASCADE
        })
        .addForeignKey('fkDoctorId', {
            local: 'doctorId',
            ref: 'User.id',
            action: lf.ConstraintAction.CASCADE
        });

}