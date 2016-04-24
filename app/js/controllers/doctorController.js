function DoctorController($scope, personModel) {

    personModel.getCurrentDoctor().then(function (persons) {
        safeApply($scope, function () {
            $scope.doctor = persons[0];
        });
    });

}