function DashboardController($scope, patientModel, examinationModel) {

    var patientsLoaded = function (patients) {
        safeApply($scope, function () {
            $scope.patients = patients;
        });
    };

    var error = function (error) {
        console.log(error);
    };

    $scope.patients = [];
    $scope.selectedPatient = null;
    $scope.selectedPatientExaminations = [];

    $scope.genderColor = genderColor;

    $scope.search = function () {
        if (!$scope.searchToken && $scope.searchToken.trim().length == 0) {
            $scope.reset();
        } else {
            patientModel.search($scope.searchToken, 10).then(patientsLoaded, error)
        }
    };

    $scope.reset = function () {
        patientModel.recent(10).then(patientsLoaded, error);
    };

    $scope.info = function (p) {
        var id = p.Patient.id;
        examinationModel.getAllByPatient(id).then(function(e){
            $scope.selectedPatientExaminations = e;
        });

        $scope.selectedPatient = p;
    };

    $scope.reset();

}