function NewPatientController($scope, $state, patientModel) {

    $scope.patient = {address: {}};
    $scope.father = {address: {}, gender: 'male'};
    $scope.mother = {address: {}, gender: 'female'};

    $scope.createPatient = function () {
        patientModel.createOrUpdate($scope.patient, $scope.father, $scope.mother).then(function (result) {

            $state.go('patients.detail', {id: result[0].id});

        }, function (error) {

            console.log(error);

        });
    };

}