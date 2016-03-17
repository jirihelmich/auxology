function DetailController($scope, $stateParams, patientModel) {

    $scope.inlineData = [34, 36, 39, 41, 44, 44, 52];
    $scope.inlineData2 = [2570, 2679, 2733, 2846, 2983, 3000, 3000, 3010];
    $scope.inlineData3 = [32, 54, 55, 56, 65, 70, 80, 80];
    $scope.inlineOptions = {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#1ab394',
        width: 100,
        height: 30
    };

    patientModel.getById($stateParams.id).then(function (p) {
        console.log(p);
        $scope.$apply(function () {
            $scope.patient = p[0];
        });
    });

}