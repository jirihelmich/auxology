function ChartController($scope, chartService){

    $scope.gender = 'female';
    $scope.weight = 'under';


    $scope.weightChart = chartService.getChart(
        $scope.gender,
        $scope.weight,
        'weight',
        {height: 700}
    );

    $scope.lengthChart = chartService.getChart(
        $scope.gender,
        $scope.weight,
        'length',
        {height: 700}
    );

    $scope.weightForLengthChart = chartService.getChart(
        $scope.gender,
        $scope.weight,
        'weightForLength',
        {height: 700}
    );

    $scope.headCircumferenceChart = chartService.getChart(
        $scope.gender,
        $scope.weight,
        'headCircumference',
        {height: 700}
    );

}