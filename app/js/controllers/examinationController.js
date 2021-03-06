function ExaminationController($scope, $state, $stateParams, patientModel, examinationModel, toaster) {

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
            $scope.examination.length = e.length ? mmToCm(e.length) : 0;
            $scope.examination.headCircumference = e.headCircumference ? mmToCm(e.headCircumference) : 0;
            $scope.examination.description = e.description;
            $scope.examination.image = e.image;
        });
    }

    $scope.hasDecimal = hasDecimal;

    $scope.createExamination = function () {
        var hasError = false;
        if (moment($scope.examination.dateTime, "D. M. Y H:m").toDate().getFullYear() < 1950) {
            notify(toaster, 'Chyba', 'Rok vyšetření je před rokem 1950.', 'error');
            hasError = true;
        }

        if (hasError)
        {
            return true;
        }
        
        examinationModel.createOrUpdate($stateParams.patientId, $scope.examination).then(function () {
            $state.go('patients.detail', {id: $stateParams.patientId});
        }, function (error) {
            console.log(error);
        });
    };

}