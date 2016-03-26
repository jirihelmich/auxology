angular.module('auxology').service('chartService', function () {
    return {
        getChart: function (gender, weight, type, options) {

            if (!gender) {
                return {};
            }

            var rows = [];

            var data = window.statisticalData[gender][weight][type];

            for (var i = 0; i < data.length; ++i) {
                rows.push({
                    c: [
                        {v: 44 + i},
                        {v: data[i][0]}, // 2.%
                        {v: data[i][1]}, // 5.%
                        {v: data[i][2]}, // 50.%
                        {v: data[i][3]}, // 95.%
                        {v: data[i][4]}, // 98.%
                    ]
                });
            }

            var chart1 = {};
            chart1.type = "google.charts.Line";
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
                    id: "5th",
                    label: "5. percentil",
                    type: "number"
                }, {
                    id: "50th",
                    label: "50. percentil",
                    type: "number"
                }, {
                    id: "95th",
                    label: "95. percentil",
                    type: "number"
                }, {
                    id: "98th",
                    label: "98. percentil",
                    type: "number"
                }],
                "rows": rows
            };

            chart1.options = {
                "title": "Křivka pacienta",
                "fill": 20,
                "height": 150,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Křivka pacienta",
                    "gridlines": {
                        "count": 10
                    },
                    "format": "decimal"
                },
                "hAxis": {
                    "format": "decimal"
                }
            };

            chart1.options = $.extend(chart1.options, options);

            return chart1;
        }
    };
});