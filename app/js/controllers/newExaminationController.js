function NewExaminationController($scope, $state, $stateParams, patientModel, examinationModel) {

    patientModel.getById($stateParams.patientId).then(function(p){
        $scope.patient = p[0];
    });

    $scope.examination = {
        dateTime: moment(new Date()).format("D. M. Y H:m")
    };

    $scope.createExamination = function () {
        examinationModel.createOrUpdate($stateParams.patientId, $scope.examination).then(function (result) {

            $state.go('patients.detail', {id: $stateParams.patientId});

        }, function (error) {

            console.log(error);

        });
    };

}