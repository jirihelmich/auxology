function DetailController($scope, $stateParams, patientModel, $state, examinationModel, chartService) {

    const statisticalDataStart = 37;

    $scope.weightCategory = '';

    $scope.inlineData = {
        weight: [],
        length: [],
        circumference: []
    };

    function chartTitle(prefix) {
        return prefix + ", " + $scope.genderName() + " s porodní hmotností " + $scope.weightCategoryName() + " 1500 g";
    }

    $scope.genderColor = function () {
        return genderColor($scope.patient);
    };

    $scope.close = function () {
        $scope.featuredChart = null;
        window.scrollTo(document.documentElement.scrollLeft, $scope.scroll);
    };

    $scope.zoom = function (chart) {
        var copy = $.extend(true, {}, chart);
        $scope.scroll = $(window).scrollTop();
        window.scrollTo(document.documentElement.scrollLeft, 0);
        copy.options.height = 900;
        delete copy.options.legend;
        $scope.featuredChart = copy;
    };

    $scope.inlineOptions = {
        type: 'line',
        lineColor: '#17997f',
        fillColor: '#1ab394',
        width: 100,
        height: 30
    };

    $scope.genderName = function () {
        if (!$scope.patient) {
            return '';
        }
        return $scope.patient.Person.gender == 'male' ? 'chlapci' : 'dívky';
    };

    $scope.weightCategoryName = function () {
        if (!$scope.patient) {
            return '';
        }
        return $scope.patient.Patient.birthWeight <= 1500 ? 'pod' : 'nad';
    };

    $scope.deleteExamination = function (e) {
        if (window.confirm("Opravdu chcete smazat toto vyšetření?")) {
            examinationModel.deleteById(e.id).then(function () {
                var idx = $scope.examinations.indexOf(e);
                $scope.examinations.splice(idx, 1);
            });
        }
    };

    $scope.delete = function () {
        if (window.confirm("Opravdu chcete smazat tohoto pacienta a všechna jeho vyšetření?")) {
            patientModel.deleteById($scope.patient.Patient.id).then(function () {
                $state.go('patients.dashboard');
            });
        }
    };

    patientModel.getById($stateParams.id).then(function (p) {
        var patient = p[0];

        $scope.parents = [{
            Person: patient.Mother,
            Address: patient.MotherAddress
        }, {
            Person: patient.Father,
            Address: patient.FatherAddress
        }];

        if (!patient) {
            return;
        }

        $scope.patient = patient;
        $scope.weightCategory = patient.Patient.birthWeight <= 1500 ? 'under' : 'above';

        var color = $scope.genderColor();
        $scope.inlineOptions.fillColor = shadeColor(color, 0.3);
        $scope.inlineOptions.lineColor = color;

        examinationModel.getAllByPatient($stateParams.id).then(function (examinations) {
            $scope.examinations = examinations;
            var weights = {};
            var lengths = {};
            var headCircumferences = {};
            var weightsForLengths = {};

            var inlineDataWeight = [];
            var inlineDataLength = [];
            var inlineDataCircumference = [];

            examinations.forEach(function (e) {
                var week = correctedWeek($scope.patient, e.dateTime);

                inlineDataWeight.unshift(e.weight);
                inlineDataLength.unshift(e.length);
                inlineDataCircumference.unshift(e.headCircumference);

                weights[week] = e.weight;
                lengths[week] = e.length;
                headCircumferences[week] = e.headCircumference;
                weightsForLengths[Math.floor(e.length / 10)] = e.weight;
            });

            if (patient.Patient.birthWeight) {
                inlineDataWeight.unshift(patient.Patient.birthWeight);
                weights[patient.Patient.birthWeek - 40] = patient.Patient.birthWeight;
            }
            if (patient.Patient.birthLength) {
                inlineDataLength.unshift(patient.Patient.birthLength);
                lengths[patient.Patient.birthWeek - 40] = patient.Patient.birthLength;
            }
            if (patient.Patient.birthHeadCircumference) {
                inlineDataCircumference.unshift(patient.Patient.birthHeadCircumference);
                headCircumferences[patient.Patient.birthWeek - 40] = patient.Patient.birthHeadCircumference;
            }

            $scope.inlineData.length = inlineDataLength;
            $scope.inlineData.weight = inlineDataWeight;
            $scope.inlineData.circumference = inlineDataCircumference;

            $scope.weightChart = chartService.getChart(
                $scope.patient.Person.gender,
                $scope.weightCategory,
                'weight',
                {
                    title: chartTitle("Tělesná hmotnost"),
                    vAxis: {
                        title: "Hmotnost [g]"
                    },
                    hAxis: {
                        title: "Korigovaný věk"
                    }
                },
                weights
            );

            $scope.lengthChart = chartService.getChart(
                $scope.patient.Person.gender,
                $scope.weightCategory,
                'length',
                {
                    title: chartTitle("Tělesná délka"),
                    vAxis: {
                        title: "Tělesná délka [cm]",
                        minValue: 35,
                        viewWindow: {
                            min: 35
                        }
                    },
                    hAxis: {
                        title: "Korigovaný věk"
                    }
                },
                lengths
            );

            $scope.weightForLengthChart = chartService.getChart(
                $scope.patient.Person.gender,
                $scope.weightCategory,
                'weightForLength',
                {
                    title: chartTitle("Hmotnost k délce"),
                    vAxis: {
                        title: "Hmotnost [g]"
                    },
                    hAxis: {
                        title: "Tělesná délka [cm]"
                    }
                },
                weightsForLengths
            );

            $scope.headCircumferenceChart = chartService.getChart(
                $scope.patient.Person.gender,
                $scope.weightCategory,
                'headCircumference',
                {
                    title: chartTitle("Obvod hlavy"),
                    vAxis: {
                        title: "Obvod hlavy [cm]"
                    },
                    hAxis: {
                        title: "Korigovaný věk"
                    }
                },
                headCircumferences
            );

            function scoreOffset(examinationDate) {
                var diff = getAgeDiff($scope.patient, examinationDate);
                var weekDiff = diff.weeks + $scope.patient.Patient.birthWeek;
                return weekDiff - statisticalDataStart;
            }

            function getStatisticalValue(functionName, patientValue, type, examinationDate) {
                if (type == 'weightForLength') {
                    return 'N/A';
                }

                patientValue = type == 'weight' ? patientValue : patientValue / 10;
                var offset = scoreOffset(examinationDate);
                return chartService[functionName]($scope.patient.Person.gender, $scope.weightCategory, patientValue, type, offset);
            }

            $scope.computePercentile = function (patientValue, type, examinationDate) {
                return getStatisticalValue('getPercentile', patientValue, type, examinationDate);
            };

            $scope.zScore = function (patientValue, type, examinationDate) {
                return getStatisticalValue('getZScore', patientValue, type, examinationDate);
            };

            $scope.computeWfLPercentile = function (weight, length) {
                var offset = Math.round(length / 10) - window.statisticalData[$scope.patient.Person.gender][$scope.weightCategory].startWeight;
                return chartService.getWfLPercentile($scope.patient.Person.gender, $scope.weightCategory, weight, offset);
            };

            $scope.zScoreWfL = function (weight, length) {
                var offset = Math.round(length / 10) - window.statisticalData[$scope.patient.Person.gender][$scope.weightCategory].startWeight;
                return chartService.getZScoreWfl($scope.patient.Person.gender, $scope.weightCategory, weight, offset);
            };
        }, function (e) {
            console.log(e);
        });
    });


}