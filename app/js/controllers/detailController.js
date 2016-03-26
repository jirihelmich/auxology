function DetailController($scope, $stateParams, patientModel, examinationModel, chartService) {

    $scope.inlineData = {
        weight: [],
        length: [],
        circumference: []
    };

    $scope.inlineOptions = {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#1ab394',
        width: 100,
        height: 30
    };

    patientModel.getById($stateParams.id).then(function (p) {
        $scope.patient = p[0];

        examinationModel.getAllByPatient($stateParams.id).then(function (examinations) {
            $scope.examinations = examinations;
            var inlineDataWeight = [];
            var inlineDataLength = [];
            var inlineDataCircumference = [];

            examinations.forEach(function (e) {
                inlineDataWeight.unshift(e.weight);
                inlineDataLength.unshift(e.length);
                inlineDataCircumference.unshift(e.headCircumference);
            });

            $scope.inlineData.length = inlineDataLength;
            $scope.inlineData.weight = inlineDataWeight;
            $scope.inlineData.circumference = inlineDataCircumference;

            $scope.weightChart = chartService.getChart(
                $scope.patient.Person.gender,
                'under',
                'weight'
            );

            $scope.lengthChart = chartService.getChart(
                $scope.patient.Person.gender,
                'under',
                'length'
            );

            $scope.weightForLengthChart = chartService.getChart(
                $scope.patient.Person.gender,
                'under',
                'weightForLength'
            );

            $scope.headCircumferenceChart = chartService.getChart(
                $scope.patient.Person.gender,
                'under',
                'headCircumference'
            );
        }, function (e) {
            console.log(e);
        });
    });


}