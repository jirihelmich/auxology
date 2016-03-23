function NewExaminationController($scope, $state, $stateParams, patientModel, examinationModel) {

    console.log($stateParams.patientId);

    patientModel.getById($stateParams.patientId).then(function(p){
        $scope.patient = p[0];
    });

    $scope.createExamination = function () {
        examinationModel.createOrUpdate($stateParams.patientId).then(function (result) {

            $state.go('patients.detail', {id: result[0].id});

        }, function (error) {

            console.log(error);

        });
    };

}