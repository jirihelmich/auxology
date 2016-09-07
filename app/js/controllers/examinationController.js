function ExaminationController($scope, $state, $stateParams, patientModel, examinationModel) {

    patientModel.getById($stateParams.patientId).then(function (p) {
        safeApply($scope, function () {
            $scope.patient = p[0];
        });
    });

    $scope.examination = {
        dateTime: formatDateTime()(new Date())
    };

    if ($stateParams.examinationId) {
        examinationModel.getById($stateParams.examinationId).then(function (examinations) {
            var e = examinations[0];
            $scope.currentExamination = e;

            $scope.examination.id = e.id;
            $scope.examination.dateTime = formatDateTime()(e.dateTime);
            $scope.examination.weight = e.weight;
            $scope.examination.length = mmToCm(e.length);
            $scope.examination.headCircumference = mmToCm(e.headCircumference);
            $scope.examination.description = e.description;
            $scope.examination.image = e.image;
        });
    }

    $scope.hasDecimal = hasDecimal;

    $scope.createExamination = function () {
        examinationModel.createOrUpdate($stateParams.patientId, $scope.examination).then(function () {
            $state.go('patients.detail', {id: $stateParams.patientId});
        }, function (error) {
            console.log(error);
        });
    };

}