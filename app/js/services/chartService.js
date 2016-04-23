angular.module('auxology').service('chartService', function () {

    function plusMinus(num) {
        if (num > 0) {
            return '+ ' + num;
        }
        if (num < 0) {
            return '- ' + Math.abs(num);
        }
        return num;
    }

    return {
        getChart: function (gender, weightCategory, type, options, patientData) {

            patientData = patientData || {};

            if (!gender) {
                return {};
            }

            var genderColor = gender == 'female' ? '#ed5565' : '#1c84c6';

            var rows = [];

            var data = window.statisticalData[gender][weightCategory][type];

            if (!data) {
                return;
            }


            var dataStartWeek = options.dataStart || -3;
            if (type === 'weightForLength') {
                dataStartWeek = window.statisticalData[gender][weightCategory].startWeight;
            }
            
            var patientWeeks = Object.keys(patientData);

            var patientStarWeek = Math.min.apply(null, patientWeeks);
            var startWeek = patientWeeks.length ? Math.min(dataStartWeek, patientStarWeek) : dataStartWeek;
            var offset = dataStartWeek - startWeek;

            var patientEndWeek = Math.max.apply(null, patientWeeks);
            var dataEndWeek = dataStartWeek + data.length - 1;
            var endWeek = patientWeeks.length ? Math.max(Math.min(patientEndWeek, 2 * dataEndWeek), dataEndWeek) : dataEndWeek;

            var length = endWeek - startWeek;
            var ratio = (type == 'length' || type == 'headCircumference') ? 10 : 1;

            for (var i = 0; i < length; ++i) {
                var isBeforeData = startWeek + i < dataStartWeek;
                var isAfterData = startWeek + i > dataEndWeek;
                var patientHasData = (startWeek + i) in patientData;

                if (isBeforeData || isAfterData) {
                    if (true || patientHasData) {
                        rows.push({
                            c: [
                                {v: startWeek + i},
                                {v: undefined},
                                {v: undefined},
                                {v: undefined},
                                {v: undefined},
                                {v: undefined},
                                {v: patientData[startWeek + i] / ratio}
                            ]
                        });
                    }
                } else {
                    rows.push({
                        c: [
                            {v: startWeek + i},
                            {v: data[i - offset][0] / ratio}, // 2.%
                            {v: data[i - offset][1] / ratio}, // 5.%
                            {v: data[i - offset][2] / ratio}, // 50.%
                            {v: data[i - offset][3] / ratio}, // 95.%
                            {v: data[i - offset][4] / ratio}, // 98.%
                            {v: patientData[startWeek + i] / ratio}
                        ]
                    });
                }
            }

            var chart1 = {};
            chart1.type = "google.visualization.LineChart";
            chart1.displayed = false;
            chart1.data = {
                "cols": [{
                    id: "week",
                    label: "Týden",
                    type: "number"
                }, {
                    id: "2rd",
                    label: "2. percentil",
                    type: "number"
                }, {
                    id: "25th",
                    label: "25. percentil",
                    type: "number"
                }, {
                    id: "50th",
                    label: "50. percentil",
                    type: "number"
                }, {
                    id: "75th",
                    label: "75. percentil",
                    type: "number"
                }, {
                    id: "98th",
                    label: "98. percentil",
                    type: "number"
                }, {
                    id: "patient",
                    label: "pacient",
                    type: "number"
                }],
                "rows": rows
            };

            chart1.options = {
                height: 350,
                vAxis: {
                    gridlines: {
                        count: 15,
                        color: '#d3d3d3'
                    },
                    format: "decimal"
                },
                hAxis: {
                    format: "decimal",
                    gridlines: {
                        color: '#d3d3d3',
                        count: 8
                    }
                },
                legend: 'none',
                series: [
                    {color: 'black', lineWidth: 1},
                    {color: 'black', lineDashStyle: [4, 4], lineWidth: 1},
                    {color: 'black', lineDashStyle: [1, 2], lineWidth: 1},
                    {color: 'black', lineDashStyle: [4, 4], lineWidth: 1},
                    {color: 'black', lineWidth: 1},
                    {color: genderColor, pointSize: 4, lineWidth: 2, type: 'line'}
                ],
                interpolateNulls: true
            };

            chart1.options = $.extend(true, chart1.options, options);

            return chart1;
        },
        getPercentile: function (gender, weightCategory, patientValue, type, lmsOffset) {
            var array = window.statisticalData[gender][weightCategory][type + 'LMS'];
            if (!array) {
                return '-';
            }
            var lms = array[lmsOffset];
            if (!lms) {
                return '-';
            }
            return Math.round(percentile(patientValue, lms));
        },
        getZScore: function (gender, weightCategory, patientValue, type, lmsOffset) {
            var array = window.statisticalData[gender][weightCategory][type + 'LMS'];
            if (!array) {
                return '-';
            }
            var lms = array[lmsOffset];
            if (!lms) {
                return '-';
            }
            return plusMinus(zScore(patientValue, lms).toFixed(2));
        },
        getWfLPercentile: function (gender, weightCategory, weight, lmsOffset) {
            var array = window.statisticalData[gender][weightCategory]['weightForLengthLMS'];
            if (!array) {
                return '-';
            }
            var lms = array[lmsOffset];
            if (!lms) {
                return '-';
            }
            return Math.round(percentile(weight, lms));
        },
        getZScoreWfl: function (gender, weightCategory, weight, lmsOffset) {
            var array = window.statisticalData[gender][weightCategory]['weightForLengthLMS'];
            if (!array) {
                return '-';
            }
            var lms = array[lmsOffset];
            if (!lms) {
                return '-';
            }
            return plusMinus(zScore(weight, lms).toFixed(2));
        }
    };
});