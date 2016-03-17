

function ChartController($scope, chartData) {

    var chart = chartData[0];
    var count = chart.labels.length;

    var rows = [];

    var last = 1230;
    for (var i = 0; i < count; ++i) {
        last += 2*(Math.random()*120);
        rows.push({
            c: [
                {v: chart.labels[i]},
                {v: chart.percentiles[3][i]},
                {v: chart.percentiles[5][i]},
                {v: chart.percentiles[50][i]},
                {v: chart.percentiles[95][i]},
                {v: chart.percentiles[97][i]},
                {v: last }
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
            id: "3rd",
            label: "3. percentil",
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
            id: "97th",
            label: "97. percentil",
            type: "number"
        }],
        "rows": rows
    };

    chart1.options = {
        "title": "Křivka pacienta",
        "fill": 20,
        "height": 700,
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
    $scope.chart = chart1;

    $scope.chart2 = $.extend(true, {}, chart1);
    $scope.chart2.options.height = 150;
    $scope.chart2.data.cols.push({
        id: "patient",
        label: "Karel Vomáčka",
        type: "number"
    });


}