/**
 * Created by jirihelmich on 12/03/16.
 */

var schemaBuilder = lf.schema.create('auxology', 5);

schemaBuilder.createTable('Address')
    .addColumn('id', lf.Type.INTEGER)
    .addColumn('street', lf.Type.STRING)
    .addColumn('city', lf.Type.STRING)
    .addColumn('country', lf.Type.STRING)
    .addPrimaryKey(['id']);

schemaBuilder.createTable('Person')
    .addColumn('id', lf.Type.INTEGER)
    .addColumn('gender', lf.Type.STRING)
    .addColumn('titlePrefix', lf.Type.STRING)
    .addColumn('firstName', lf.Type.STRING)
    .addColumn('lastName', lf.Type.STRING)
    .addColumn('titlePostfix', lf.Type.STRING)
    .addColumn('birthNumber', lf.Type.STRING)
    .addColumn('addressId', lf.Type.INTEGER)
    .addColumn('birthTime', lf.Type.DATE_TIME)
    .addPrimaryKey(['id'])
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
    .addColumn('salt', lf.Type.STRING)
    .addPrimaryKey(['id'])
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
    .addColumn('isActive', lf.Type.BOOLEAN)
    .addColumn('birthWeek', lf.Type.INTEGER)
    .addColumn('birthWeight', lf.Type.INTEGER)
    .addPrimaryKey(['id'])
    .addForeignKey('fkPersonId', {
        local: 'personId',
        ref: 'Person.id',
        action: lf.ConstraintAction.CASCADE
    })
    .addIndex('idxPersonId', ['personId']);

schemaBuilder.createTable('Examination')
    .addColumn('id', lf.Type.INTEGER)
    .addColumn('patientId', lf.Type.INTEGER)
    .addColumn('dateTime', lf.Type.DATE_TIME)
    .addColumn('weight', lf.Type.INTEGER)
    .addColumn('height', lf.Type.INTEGER)
    .addColumn('headCircumference', lf.Type.INTEGER)
    .addColumn('description', lf.Type.STRING)
    .addColumn('highlight', lf.Type.STRING)
    .addPrimaryKey(['id'])
    .addForeignKey('fkPatientId', {
        local: 'patientId',
        ref: 'Patient.id',
        action: lf.ConstraintAction.CASCADE
    });


schemaBuilder.connect().then(function (db) {

});