function ChartController($scope, chartService) {

    $scope.gender = 'male';
    $scope.weightCategory = 'under';
    $scope.activeTab = 1;

    $scope.chart = function (activeTab, weightCategory, gender) {
        $scope.activeTab = activeTab;
        $scope.weightCategory = weightCategory;
        $scope.gender = gender;
        createCharts();
    };

    function createCharts() {

        $scope.weightChart = chartService.getChart(
            $scope.gender,
            $scope.weightCategory,
            'weight',
            {height: 700, legend: 'right'}
        );

        $scope.lengthChart = chartService.getChart(
            $scope.gender,
            $scope.weightCategory,
            'length',
            {height: 700, legend: 'right'}
        );

        $scope.weightForLengthChart = chartService.getChart(
            $scope.gender,
            $scope.weightCategory,
            'weightForLength',
            {height: 700, legend: 'right'}
        );

        $scope.headCircumferenceChart = chartService.getChart(
            $scope.gender,
            $scope.weightCategory,
            'headCircumference',
            {height: 700, legend: 'right'}
        );
    }

    $scope.print = function () {
        window.print();
    };

    createCharts();

}