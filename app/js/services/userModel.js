angular.module('auxology').service('userModel', ['asyncUtils', 'passwordService', 'lovefield', function (asyncUtils, passwordService, lovefield) {
    return {
        create: function (username, password) {
            return asyncUtils.deferredAction(function (resolve, reject) {
                passwordService.hash(password).then(function (encrypted) {

                    lovefield.getDB().then(function (db) {

                        var addressTable = db.getSchema().table('Address');
                        var address = addressTable.createRow({});

                        db.insertOrReplace().into(addressTable).values([address]).exec()
                            .then(function (addressResponse) {

                                var personTable = db.getSchema().table('Person');
                                var person = personTable.createRow({addressId: addressResponse[0].id});

                                db.insertOrReplace().into(personTable).values([person]).exec()
                                    .then(function (personResponse) {

                                        var table = db.getSchema().table('User');

                                        var row = table.createRow({
                                            username: username,
                                            password: encrypted,
                                            personId: personResponse[0].id
                                        });

                                        db.insertOrReplace().into(table).values([row]).exec()
                                            .then(function (response) {
                                                resolve(response);
                                            }, reject);

                                    }, reject);

                            }, reject);
                    });


                }, reject);
            });
        },
        getByUsername: function (username) {
            return asyncUtils.deferredAction(function (resolve, reject) {

                lovefield.getDB().then(function (db) {
                    var userTable = db.getSchema().table('User');
                    resolve(db.select().from(userTable).where(userTable.username.eq(username)).exec());
                }, reject);

            });
        }
    };
}]);