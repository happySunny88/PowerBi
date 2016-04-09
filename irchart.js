var webtrends1 = true;
var IR = IR || {};
var $$ = function (id) { return document.getElementById(id); }

/* Define some animation easing functions here.
   For each easing function, generally there are four parameters need to be initialized before running:
   @t - current time
   @b - beginning value
   @c - change in value
   @d - duration
*/

IR.Tween = {
    Back: {
        easeIn: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function (t, b, c, d) {
            return c - IR.Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) return IR.Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else return IR.Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
};

IR.Common = {
    getOneRankArray: function (array, results) {
        results = results || [];
        if (Object.prototype.toString.call(array).toLowerCase() == "[object array]") {
            for (var i = 0, ci; ci = array[i], i < array.length; i++) {
                arguments.callee(ci, results);
            }
        }
        else {
            results.push(array);
        }
        return results;
    },
    getRange: function (data, isEpsBar, decimalNo) {
        var array = this.getOneRankArray(data);
        var maxValue, minValue;
        var _tmpArray = [];
        for (var i = 0, j = 0; i < array.length; i++) {
            if (array[i] != "NA")
                _tmpArray[j++] = array[i];
        }
        maxValue = Math.max.apply(null, _tmpArray);
        minValue = Math.min.apply(null, _tmpArray);
        var scale;
        if (minValue >= 0) {
            if (!isEpsBar) {
                if (maxValue >= 21) {
                    scale = IR.util.mul(Math.ceil(IR.util.div(maxValue, 6)), 2);
                }
                else if (maxValue <= 4) {
                    scale = IR.util.div(Math.ceil(IR.util.div(IR.util.mul(maxValue, 10), 3)), 10);
                }
                else {
                    scale = Math.ceil(IR.util.div(maxValue, 3));
                }

                return { range: [0, IR.util.mul(scale, 3)], scale: scale };//[0, IR.util.mul(scale, 3)];

            }
            else {
                scale = (maxValue / 3).toFixed(2);
                scale = (parseFloat(scale));
                scale = (scale * 100) % 2 == 0 ? scale : scale + 0.01;
                var tmpmax = (scale * 3).toFixed(decimalNo);
                return { range: [0.00, parseFloat(tmpmax)], scale: scale };// [0.00, parseFloat(tmpmax)];
            }
        }
        else if (maxValue <= 0) {
            if (!isEpsBar) {
                if (-minValue >= 30) {
                    scale = IR.util.mul(Math.ceil(IR.util.div(IR.util.mul(Math.abs(minValue), 10), 56)), 2);
                }
                else if (-minValue <= 9) {
                    scale = IR.util.div(Math.ceil(-IR.util.div(IR.util.mul(minValue, 10), 2.8)), 10);
                }
                else {
                    scale = Math.ceil(-IR.util.div(IR.util.mul(minValue, 10), 28));
                }
                return { range: [-IR.util.mul(scale, 3), 0], scale: scale };//[-IR.util.mul(scale, 3), 0];
            }
            else {
                scale = (Math.abs(minValue) / 2.8).toFixed(2);
                scale = (parseFloat(scale));
                scale = (scale * 100) % 2 == 0 ? scale : scale + 0.01
                var tmpmin = 0 - parseFloat((scale * 3).toFixed(decimalNo));
                return { range: [tmpmin, 0.00], scale: scale };//[tmpmin, 0.00];
            }

        } else if (Math.abs(minValue) > Math.abs(maxValue)) {
            if (!isEpsBar) {
                if (IR.util.div((-minValue), 1.8) > maxValue) {
                    if (-minValue >= 15) {
                        scale = Math.round((-minValue) / (1.8 * 2)) * 2;
                    }
                    else if (-minValue <= 7) {
                        scale = Math.ceil(-minValue * 10 / 1.8) / 10;
                    }
                    else {
                        scale = Math.ceil(-minValue / 1.8);
                    }
                }
                else {
                    if (maxValue >= 1) {
                        scale = Math.ceil(maxValue / 2) * 2;
                    }
                    else {
                        scale = Math.ceil(maxValue * 10) / 10;
                    }
                }

                return { range: [-scale * 2, scale], scale: scale };//[-scale * 2, scale];
            }
            else {
                scale = parseFloat(scale);
                scale = ((-minValue) / 1.8 > maxValue) ? ((-minValue) / 1.8).toFixed(2) : maxValue.toFixed(2);
                scale = (parseFloat(scale));
                scale = (scale * 100) % 2 == 0 ? scale : scale + 0.01;
                var tmpmax = parseFloat(parseFloat(scale).toFixed(decimalNo));
                var tmpmin = parseFloat((parseFloat(scale) * 2).toFixed(decimalNo));
                return { range: [-tmpmin, tmpmax], scale: scale };//[-tmpmin, tmpmax];
            }
        }
        else if (Math.abs(minValue) <= Math.abs(maxValue)) {
            if (!isEpsBar) {
                if (maxValue / 2 > (-minValue)) {
                    if (maxValue >= 15) {
                        scale = Math.ceil(maxValue / (2 * 2)) * 2;
                    }
                    else if (maxValue <= 5) {
                        scale = Math.ceil(maxValue * 10 / 2) / 10;
                    }
                    else {
                        scale = Math.ceil(maxValue / 2);
                    }
                }
                else {
                    if (-minValue >= 2) {
                        scale = Math.ceil(-minValue / (0.8 * 2)) * 2;
                    }
                    else if (-minValue <= 1) {
                        scale = Math.ceil(-minValue * 10 / 0.8) / 10;
                    }
                    else {
                        scale = Math.ceil(-minValue / 0.8);
                    }
                }
                var tmpmax = scale * 2;
                var tmpmin = scale;
                return { range: [-tmpmin, tmpmax], scale: scale };//[-tmpmin, tmpmax];

            }
            else {
                scale = (maxValue / 2 > (-minValue / 0.8)) ? (maxValue / 2).toFixed(2) : (-minValue / 0.8).toFixed(2);
                scale = (parseFloat(scale));
                scale = scale * 100 % 2 == 0 ? scale : scale + 0.01;
                var tmpmax = scale * 2;
                var tmpmin = scale;
                return { range: [-tmpmin, tmpmax], scale: scale };//[-tmpmin, tmpmax];
            }
        }
    },
    getLeftRange: function (data) {

        var ta = this.getMaxOrMin(data);
        var maxValue = ta.max;
        var minValue = ta.min;
        var scale = Math.ceil((maxValue - minValue) / (5 - 2));
        return { range: [0, scale * 4], scale: scale };//[0, scale * 4];
    },
    getRightRange: function (data) {
        var ta = this.getMaxOrMin(data);
        var maxValue = ta.max;
        var minValue = ta.min;
        var scale = parseFloat(((maxValue - minValue) / (5 - 1)).toFixed(2));
        return { range: [0, parseFloat(scale) * 4], scale: scale };//[0, parseFloat(scale) * 4];
    },
    getMaxOrMin: function (data) {
        var maxValue, minValue;
        var array = this.getOneRankArray(data);
        maxValue = Math.max.apply(null, array);
        minValue = Math.min.apply(null, array);
        if (minValue > 0) {
            minValue = 0;
        } else if (maxValue < 0) {
            maxValue = 0;
        }
        else {
            var tmp = minValue;
            minValue = maxValue;
            maxValue = tmp;
        }
        return { max: maxValue, min: minValue };
    },
    addWebTrends: function (WTTi, WTEvent) {
        if (typeof $ != "undefined"
        && typeof $.bi != "undefined"
          && typeof $.bi.dataConsumers != "undefined"
        && typeof $.bi.dataConsumers.webtrends != "undefined"
        && typeof $.bi.dataConsumers.webtrends.WebTrends != "undefined") {
            $.bi.dataConsumers.webtrends.WebTrends.dcsMultiTrack('DCS.dcsuri', window.location.pathname, 'WT.ti', WTTi, 'WT.inv_event', WTEvent, 'WT.dl', '7');
        }
    }
}

IR.ChartView = function (params) {
    var defaults = {
        chartType: "bar",
        renderTo: "svg1",
        data: { chartTitle: "Operating Income (Loss)", segmentType: ["Revenue"] },
        precision: 2,
        scalePrecision: {},
        width: 160,//400
        height: 128,//128
        scale: 1,
        jsonData: {},
        linecolor: "rgb(230,230,230)",
        labcolor: "rgb(119,119,119)",
        yAxisCount: 4,
        title: "",
        subTitle: "",
        titleHeight: 13,//10

        tabHeight: 10,//8
        tabWidth: 50,//130
        tabLabel: ["Quarterly", "Year To Data"],
        defaultTab: "Quarterly",

        yStart: 37,//32
        footHeight: 32,//80

        groupTitles: ['Devices and Consumer Licensing', 'Computing and Gaming Hardware', 'Phone Hardware', 'Devices and Consumer Other', 'Commercial Licensing', 'Commercial Other'],
        color: ["#FF8C00", "#7FBA00", "#007233", "#68217A", "#0072C6", "#00B294"],
        footerLabel: ["Revenue", "Operating Income"]//for barversus page
    }
    defaults.scale = parseFloat($("#" + params.renderTo).parent().width() / params.width).toFixed(2);
    //console.log(defaults.scale);

    // merge params into defaults
    $.extend(defaults, params);

    for (var i = 0; i < defaults.groupTitles.length; i++) {
        defaults.groupTitles[i] = defaults.groupTitles[i].replace("&amp;", "&");
    }

    var chart = IR.Config(defaults);
    chart.init();
    switch (defaults.chartType) {
        case "cash":

            chart.createCashChart();
            break;
        case "barversus":
            chart.createBarVersus();
            break;
        case "doughnut":
            chart.createDonut();
            break;
        case "barsegment":
            chart.createBarSegment();
            break;
        default:
            chart.createBarChart();
            break;
    }
    return chart;
}

IR.Config = function (params) {
    var settings = params;
    //settings.height = 108;
    var data;
    var leftScale = {};
    var rightScale = {};
    var labels = {};//at bottom
    var values = {};
    var valuesChange = {};
    var leftRange = {};//刻度的range
    var rightRange = {};
    var backcolor = ["#00b193", "#0072c5"];
    var unallocatedValue = {};//饼状图最下方的数
    var pined = false;//大头针是否是固定状态
    var bQuarterly = true;//used for donut
    var webtrends1 = false;
    return {
        init: function () {
            //window.dataModel = window.dataModel || IR.DataModel(settings.xmlFile);
            // window.dataModel = window.dataModel || { Quarterly: { labs: ['Q314', 'Q414', 'Q115', 'Q215', 'Q315'], values: ['14.425', '15.749', '14.928', '16.334', '14.568'] }, YearToDate: { labs: ['FY14', 'FY15'], values: ['44.006', '45.830'] } };
            window.dataModel = settings.jsonData;
            //data = dataModel[settings.chartType](settings.data);
            data = dataModel;
            labels.Quarterly = data.Quarterly.labs;
            labels.YearToDate = data.YearToDate.labs;
            values.Quarterly = data.Quarterly.values;
            values.YearToDate = data.YearToDate.values;

            var title = settings.title;
            var lossArray = [];
            function loss(array) {
                if (Object.prototype.toString.call(array).toLowerCase() == "[object array]") {
                    for (var i = 0; i < array.length; i++) {
                        arguments.callee(array[i]);
                    }
                }
                else {
                    var tmp = array <= 0 ? 0 : 1;
                    lossArray.push(tmp);
                }
            }
            loss([values.Quarterly, values.YearToDate]);
            var sum = lossArray.reduce(function (pv, cv, ci) {
                return pv + cv;
            }, 0);
            if (sum == 0) {
                title = title.replace(/income/i, "").replace(/profit/i, "").replace(/\(|\)/g, "");
                //title = title.replace(/profit/i, "").replace(/\(|\)/g, "");
            }
            else if (sum == lossArray.length) {
                title = title.replace(/\(loss\)/i, "");
            }
            else {
                title = title;
            }
            settings.title = title;

            switch (settings.chartType) {
                case "cash":
                    {
                        //settings.height = 12;
                        var yEnd = settings.height - settings.footHeight;
                        var tmparray = [];
                        for (var i = 0; i < values.Quarterly[0].length; i++) {
                            tmparray.push(parseFloat(values.Quarterly[0][i]) + parseFloat(values.Quarterly[1][i]));
                        }
                        var qlrange = IR.Common.getLeftRange(tmparray);
                        var qrrange = IR.Common.getRightRange(values.Quarterly[2]);
                        var qlscale = qlrange.scale;
                        var qrscale = qrrange.scale;
                        tmparray = [];
                        for (var i = 0; i < values.YearToDate[0].length; i++) {
                            tmparray.push(parseFloat(values.YearToDate[0][i]) + parseFloat(values.YearToDate[1][i]));
                        }
                        var ylrange = IR.Common.getLeftRange(tmparray);
                        var yrrange = IR.Common.getRightRange(values.YearToDate[2]);
                        var ylscale = ylrange.scale;
                        var yrscale = yrrange.scale;
                        backcolors = ["#0072C5", "#00B193", "RGB(255,216,0)"];
                        //lines = [0.18, 0.34, 0.50, 0.66, 0.82];
                        leftScale.Quarterly = d3.scale.linear()
                            .domain(qlrange.range)
                            .range([yEnd, settings.yStart]);
                        leftScale.YearToDate = d3.scale.linear()
                            .domain(ylrange.range)
                            .range([yEnd, settings.yStart]);
                        rightScale.Quarterly = d3.scale.linear()
                            .domain(qrrange.range)
                            .range([yEnd, settings.yStart]);
                        rightScale.YearToDate = d3.scale.linear()
                            .domain(yrrange.range)
                            .range([yEnd, settings.yStart]);
                        leftRange.Quarterly = [];
                        leftRange.YearToDate = [];
                        rightRange.Quarterly = [];
                        rightRange.YearToDate = [];
                        for (var i = 0; i < settings.yAxisCount; i++) {
                            var qlvalue = parseFloat(d3.min(qlrange.range) + qlscale * i);
                            var ylvalue = parseFloat(d3.min(ylrange.range) + ylscale * i);
                            var qrvalue = parseFloat(d3.min(qrrange.range) + qrscale * i);
                            var yrvalue = parseFloat(d3.min(yrrange.range) + yrscale * i);
                            if (settings.scalePrecision.left != null && settings.scalePrecision.left != -1) {
                                qlvalue = qlvalue.toFixed(settings.scalePrecision.left);
                                ylvalue = ylvalue.toFixed(settings.scalePrecision.left);
                            }
                            if (settings.scalePrecision.right != null) {
                                qrvalue = qrvalue.toFixed(settings.scalePrecision.right);
                                yrvalue = yrvalue.toFixed(settings.scalePrecision.right);
                            }
                            leftRange.Quarterly.push(qlvalue);
                            leftRange.YearToDate.push(ylvalue);
                            rightRange.Quarterly.push(qrvalue);
                            rightRange.YearToDate.push(yrvalue);
                        }
                        break;
                    }
                case "barversus":
                    {
                        labels.Quarterly = [labels.Quarterly[0][0], labels.Quarterly[0][1], "", labels.Quarterly[1][0], labels.Quarterly[1][1], ""];
                        labels.YearToDate = [labels.YearToDate[0][0], labels.YearToDate[0][1], "", labels.YearToDate[1][0], labels.YearToDate[1][1], ""];
                        values.Quarterly = values.Quarterly[0].concat([0], values.Quarterly[1], [0]);
                        values.YearToDate = values.YearToDate[0].concat([0], values.YearToDate[1], [0]);
                        if (data.Quarterly.change[0] && data.YearToDate.change[0]) {
                            valuesChange.Quarterly = data.Quarterly.change;
                            valuesChange.YearToDate = data.YearToDate.change;
                        }
                        else {
                            var qval0 = data.Quarterly.values[0];
                            var qval1 = data.Quarterly.values[1];
                            var yval0 = data.YearToDate.values[0];
                            var yval1 = data.YearToDate.values[1];
                            var qchange0 = ((qval0[1] - qval0[0]) / qval0[0]).toFixed(2);
                            var qchange1 = ((qval1[1] - qval1[0]) / qval1[0]).toFixed(2);
                            var ychange0 = ((yval0[1] - yval0[0]) / yval0[0]).toFixed(2);
                            var ychange1 = ((yval1[1] - yval1[0]) / yval1[0]).toFixed(2);
                            valuesChange.Quarterly = [qchange0, qchange1];
                            valuesChange.YearToDate = [ychange0, ychange1];
                        }


                        var qRange = IR.Common.getRange(values.Quarterly, false);
                        var yRange = IR.Common.getRange(values.YearToDate, false);
                        var yEnd = settings.height - settings.footHeight;
                        leftScale.Quarterly = d3.scale.linear()
                            .domain(qRange.range)
                            .range([yEnd, settings.yStart]);
                        leftScale.YearToDate = d3.scale.linear()
                            .domain(yRange.range)
                            .range([yEnd, settings.yStart]);
                        var qscale = qRange.scale;
                        var yscale = yRange.scale;
                        leftRange.Quarterly = [];
                        leftRange.YearToDate = [];
                        for (var i = 0; i < settings.yAxisCount; i++) {
                            var qvalue = parseFloat(d3.min(qRange.range) + IR.util.mul(qscale, i));
                            var yvalue = parseFloat(d3.min(yRange.range) + IR.util.mul(yscale, i));
                            if (settings.scalePrecision.left != null) {
                                qvalue = qvalue.toFixed(settings.scalePrecision.left);
                                yvalue = yvalue.toFixed(settings.scalePrecision.left);
                            }
                            leftRange.Quarterly.push(qvalue);
                            leftRange.YearToDate.push(yvalue);
                        }
                        break;
                    }
                case "epsbar":
                    {
                        var qRange = IR.Common.getRange(values.Quarterly, true, 2);
                        var yRange = IR.Common.getRange(values.YearToDate, true, 2);
                        var yEnd = settings.height - settings.footHeight;
                        leftScale.Quarterly = d3.scale.linear()
                            .domain(qRange.range)
                            .range([yEnd, settings.yStart]);
                        leftScale.YearToDate = d3.scale.linear()
                            .domain(yRange.range)
                            .range([yEnd, settings.yStart]);
                        var qscale = qRange.scale;
                        var yscale = yRange.scale;
                        leftRange.Quarterly = [];
                        leftRange.YearToDate = [];
                        for (var i = 0; i < settings.yAxisCount; i++) {
                            var qvalue = parseFloat(d3.min(qRange.range) + IR.util.mul(qscale, i));
                            var yvalue = parseFloat(d3.min(yRange.range) + IR.util.mul(yscale, i));
                            if (settings.scalePrecision.left != null) {
                                qvalue = qvalue.toFixed(settings.scalePrecision.left);
                                yvalue = yvalue.toFixed(settings.scalePrecision.left);
                            }
                            leftRange.Quarterly.push(qvalue);
                            leftRange.YearToDate.push(yvalue);
                        }
                        break;
                    }
                case "doughnut": {
                    var length = values.Quarterly[0].length - 1;
                    unallocatedValue.Quarterly = [values.Quarterly[0][length], values.Quarterly[1][length]];
                    unallocatedValue.YearToDate = [values.YearToDate[0][length], values.YearToDate[1][length]];
                    values.Quarterly[0].pop();
                    values.Quarterly[1].pop();
                    values.YearToDate[0].pop();
                    values.YearToDate[1].pop();
                    break;
                };
                case "barsegment":
                    {
                        var qlab = [];
                        var ylab = [];
                        for (var i = 0; i < labels.Quarterly.length; i++) {
                            qlab.push(labels.Quarterly[i][0] + " " + labels.Quarterly[i][1]);
                            ylab.push(labels.YearToDate[i][0] + " " + labels.YearToDate[i][1]);
                        }
                        labels.Quarterly = qlab;
                        labels.YearToDate = ylab;
                        if (values.Quarterly.length == 3) {
                            values.Quarterly = values.Quarterly[0].concat(values.Quarterly[1], values.Quarterly[2]);
                            values.YearToDate = values.YearToDate[0].concat(values.YearToDate[1], values.YearToDate[2]);
                        }
                        else if (values.Quarterly.length == 4) {
                            values.Quarterly = values.Quarterly[0].concat(values.Quarterly[1], values.Quarterly[2], values.Quarterly[3]);
                            values.YearToDate = values.YearToDate[0].concat(values.YearToDate[1], values.YearToDate[2], values.YearToDate[3]);
                        }
                        else if (values.Quarterly.length == 5) {
                            values.Quarterly = values.Quarterly[0].concat(values.Quarterly[1], values.Quarterly[2], values.Quarterly[3], values.Quarterly[4]);
                            values.YearToDate = values.YearToDate[0].concat(values.YearToDate[1], values.YearToDate[2], values.YearToDate[3], values.YearToDate[4]);
                        }
                        else {
                            values.Quarterly = values.Quarterly[0].concat(values.Quarterly[1], values.Quarterly[2], values.Quarterly[3], values.Quarterly[4], values.Quarterly[5]);
                            values.YearToDate = values.YearToDate[0].concat(values.YearToDate[1], values.YearToDate[2], values.YearToDate[3], values.YearToDate[4], values.YearToDate[5]);
                        }

                    }
                default:
                    {
                        var qRange = IR.Common.getRange(values.Quarterly, false);
                        var yRange = IR.Common.getRange(values.YearToDate, false);
                        var yEnd = settings.height - settings.footHeight;
                        leftScale.Quarterly = d3.scale.linear()
                            .domain(qRange.range)
                            .range([yEnd, settings.yStart]);
                        leftScale.YearToDate = d3.scale.linear()
                            .domain(yRange.range)
                            .range([yEnd, settings.yStart]);
                        var qscale = qRange.scale;
                        var yscale = yRange.scale;
                        leftRange.Quarterly = [];
                        leftRange.YearToDate = [];
                        for (var i = 0; i < settings.yAxisCount; i++) {
                            // var qvalue = parseFloat(d3.min(qRange.range) + IR.util.mul(qscale, i));
                            // var yvalue = parseFloat(d3.min(yRange.range) + IR.util.mul(yscale, i));
                            var qvalue = IR.util.add(d3.min(qRange.range), IR.util.mul(qscale, i));
                            var yvalue = IR.util.add(d3.min(yRange.range), IR.util.mul(yscale, i));
                            if (settings.scalePrecision.left != null) {
                                qvalue = qvalue.toFixed(settings.scalePrecision.left);
                                yvalue = yvalue.toFixed(settings.scalePrecision.left);
                            }
                            leftRange.Quarterly.push(qvalue);
                            leftRange.YearToDate.push(yvalue);
                        }
                        break;
                    }
            }


        }
        , createBarChart: function () {
            var that = this;
            var svg = d3.select("body").select("#" + settings.renderTo)
                .attr("viewBox", "0 0 " + settings.width + " " + settings.height)
                .attr("preserveAspectRatio", "xMaxYMin meet")
                .attr("width", settings.width * settings.scale)
                .attr("height", settings.height * settings.scale);
            var g = svg.append("g").style("cursor", "default");//.attr("transform", "scale(0.5)");
            var data = this.applyTitle(g);
            var gQuar = data[0];
            var gYear = data[1];

            //当前Q或FY的白色背景
            var currentRect = g.append("rect").attr("fill", "url(#currbgcolor" + settings.renderTo + ")");

            //横轴分割线，横轴上的文字
            var gTxtAxis = this.applyAxisAndText(g);

            //Y轴分割线，柱子，柱子上的文字
            var gContent = g.append("g").attr("font-size", 4.8).attr("fill", "gray");

            var showRect = this.drawRect(g, 0, 0, 18, 7, "black")
                                .attr("display", "none")
                                .attr("rx", 4)
                                .attr("ry", 4)
                                .attr("class", "showRect");
            var showText = this.drawText(g, 3, 6, "", 4.8, "white")
                                .attr("font-weight", "bold")
                                .attr("display", "none")
                                .attr("class", "showText");

            if (settings.defaultTab == "Quarterly") {
                this.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, [currentRect]);
                this.switchBar(values.Quarterly, leftScale.Quarterly, gContent, g, showRect, showText);
            }
            else {
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, [currentRect]);
                this.switchBar(values.YearToDate, leftScale.YearToDate, gContent, g, showRect, showText);
            }

            /*添加gQuar的click事件*/
            gQuar.on("click", function () {
                that.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, [currentRect]);
                var bar = that.switchBar(values.Quarterly, leftScale.Quarterly, gContent, g, showRect, showText);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, [currentRect]);
                var bar = that.switchBar(values.Quarterly, leftScale.Quarterly, gContent, g, showRect, showText);
            });
            /*添加gYear的click事件*/
            gYear.on("click", function () {
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, [currentRect]);
                var bar = that.switchBar(values.YearToDate, leftScale.YearToDate, gContent, g, showRect, showText);
                IR.Common.addWebTrends(settings.title, "ChangeTab");

            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, [currentRect]);
                var bar = that.switchBar(values.YearToDate, leftScale.YearToDate, gContent, g, showRect, showText);
            });

            this.drawRect(g, 0, 0, settings.width, settings.height, "none").attr("stroke", "#dedede").attr("pointer-events", "none");
        }
        , createBarVersus: function () {
            var that = this;
            var svg = d3.select("body").select("#" + settings.renderTo)
                            .attr("viewBox", "0 0 " + settings.width + " " + settings.height)
                .attr("preserveAspectRatio", "xMaxYMin meet")
                .attr("width", settings.width * settings.scale)
                .attr("height", settings.height * settings.scale);
            var g = svg.append("g").style("cursor", "default");//.attr("transform", "scale(0.5)");
            var data = this.applyTitle(g);
            var gQuar = data[0];
            var gYear = data[1];

            //当前Q或FY的白色背景
            var currentRect1 = g.append("rect").attr("fill", "url(#currbgcolor" + settings.renderTo + ")");
            var currentRect2 = g.append("rect").attr("fill", "url(#currbgcolor" + settings.renderTo + ")");

            //横轴分割线，横轴上的文字
            var gTxtAxis = this.applyAxisAndText(g);

            var showRect = this.drawRect(g, 0, 0, 18, 7, "black")
                                .attr("display", "none")
                                .attr("rx", 4)
                                .attr("ry", 4)
                                .attr("class", "showRect");
            var showText = this.drawText(g, 3, 6, "", 4.8, "white")
                                .attr("font-weight", "bold")
                                .attr("display", "none")
                                .attr("class", "showText");

            //Y轴分割线，柱子，柱子上的文字
            var gContent = g.append("g").attr("font-size", 4.8).attr("fill", "gray");
            if (settings.defaultTab == "Quarterly") {
                this.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, [currentRect1, currentRect2], null, null, 4);
                var bar = this.switchBar(values.Quarterly, leftScale.Quarterly, gContent, g, showRect, showText);
                that.drawBarVersus(bar, valuesChange.Quarterly);
            }
            else {
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, [currentRect1, currentRect2], null, null, 4);
                var bar = that.switchBar(values.YearToDate, leftScale.YearToDate, gContent, g, showRect, showText);
                that.drawBarVersus(bar, valuesChange.YearToDate);
            }

            that.drawRect(g, 0, settings.height - 11, settings.width, 11, "#F0F0F0");
            that.drawText(g, 30, settings.height - 6, settings.footerLabel[0], 5.5, "black").attr("font-weight", "bold");
            that.drawText(g, 90, settings.height - 6, settings.footerLabel[1], 5.5, "black").attr("font-weight", "bold");

            /*添加gQuar的click事件*/
            gQuar.on("click", function () {
                that.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, [currentRect1, currentRect2], null, null, 4);
                var bar = that.switchBar(values.Quarterly, leftScale.Quarterly, gContent, g, showRect, showText);
                that.drawBarVersus(bar, valuesChange.Quarterly);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, [currentRect1, currentRect2], null, null, 4);
                var bar = that.switchBar(values.Quarterly, leftScale.Quarterly, gContent, g, showRect, showText);
                that.drawBarVersus(bar, valuesChange.Quarterly);
            });
            /*添加gYear的click事件*/
            gYear.on("click", function () {
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, [currentRect1, currentRect2], null, null, 4);
                var bar = that.switchBar(values.YearToDate, leftScale.YearToDate, gContent, g, showRect, showText);
                that.drawBarVersus(bar, valuesChange.YearToDate);
                IR.Common.addWebTrends(settings.title, "ChangeTab");

            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, [currentRect1, currentRect2], null, null, 4);
                var bar = that.switchBar(values.YearToDate, leftScale.YearToDate, gContent, g, showRect, showText);
                that.drawBarVersus(bar, valuesChange.YearToDate);
            });

            this.drawRect(g, 0, 0, settings.width, settings.height, "none").attr("stroke", "#dedede").attr("pointer-events", "none");
        }
        , createCashChart: function () {
            var that = this;
            var svg = d3.select("body").select("#" + settings.renderTo)
                               .attr("viewBox", "0 0 " + settings.width + " " + settings.height)
                .attr("preserveAspectRatio", "xMaxYMin meet")
                .attr("width", settings.width * settings.scale)
                .attr("height", settings.height * settings.scale);
            var g = svg.append("g").style("cursor", "default");//.attr("transform", "scale(0.5)");
            var data = this.applyTitle(g);
            var gQuar = data[0];
            var gYear = data[1];

            //当前Q或FY的白色背景
            var currentRect = g.append("rect").attr("fill", "url(#currbgcolor" + settings.renderTo + ")");

            //横轴分割线，横轴上的文字
            var gTxtAxis = this.applyAxisAndText(g);

            //最底层的复选框
            var gCheck = this.applyCheckbox(g);

            //Y轴分割线，柱子，柱子上的文字
            var gContent = g.append("g").attr("font-size", 5).attr("fill", "gray");
            if (settings.defaultTab == "Quarterly") {
                gCheck.select("g").select("text").text("Dividends Per Share");
                gCheck.select("g").selectAll("text:nth-of-type(2)").attr("x", 92);
                that.changeBarCommon("left", data[2], [leftRange.Quarterly, rightRange.Quarterly], labels.Quarterly[0], gTxtAxis, gContent, [currentRect], 5, 120);//5 120
                that.switchCashChart(values.Quarterly, leftScale.Quarterly, rightScale.Quarterly, gContent, g, gCheck);
            }
            else {
                gCheck.select("g").select("text").text("Cash Dividends Declared Per Share");
                gCheck.select("g").selectAll("text:nth-of-type(2)").attr("x", 125);
                that.changeBarCommon("right", data[2], [leftRange.YearToDate, rightRange.YearToDate], labels.YearToDate[0], gTxtAxis, gContent, [currentRect], 5, 120);
                that.switchCashChart(values.YearToDate, leftScale.YearToDate, rightScale.YearToDate, gContent, g, gCheck);
            }

            /*添加gQuar的click事件*/
            gQuar.on("click", function () {
                gCheck.select("g").select("text").text("Dividends Per Share");
                gCheck.select("g").selectAll("text:nth-of-type(2)").attr("x", 92);
                that.changeBarCommon("left", data[2], [leftRange.Quarterly, rightRange.Quarterly], labels.Quarterly[0], gTxtAxis, gContent, [currentRect], 5, 120);
                that.switchCashChart(values.Quarterly, leftScale.Quarterly, rightScale.Quarterly, gContent, g, gCheck);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                gCheck.select("g").select("text").text("Dividends Per Share");
                gCheck.select("g").selectAll("text:nth-of-type(2)").attr("x", 92);
                that.changeBarCommon("left", data[2], [leftRange.Quarterly, rightRange.Quarterly], labels.Quarterly[0], gTxtAxis, gContent, [currentRect], 5, 120);
                that.switchCashChart(values.Quarterly, leftScale.Quarterly, rightScale.Quarterly, gContent, g, gCheck);
            });
            /*添加gYear的click事件*/
            gYear.on("click", function () {
                gCheck.select("g").select("text").text("Cash Dividends Declared Per Share");
                gCheck.select("g").selectAll("text:nth-of-type(2)").attr("x", 125);
                that.changeBarCommon("right", data[2], [leftRange.YearToDate, rightRange.YearToDate], labels.YearToDate[0], gTxtAxis, gContent, [currentRect], 5, 120);
                that.switchCashChart(values.YearToDate, leftScale.YearToDate, rightScale.YearToDate, gContent, g, gCheck);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                gCheck.select("g").select("text").text("Cash Dividends Declared Per Share");
                gCheck.select("g").selectAll("text:nth-of-type(2)").attr("x", 125);
                that.changeBarCommon("right", data[2], [leftRange.YearToDate, rightRange.YearToDate], labels.YearToDate[0], gTxtAxis, gContent, [currentRect], 5, 120);
                that.switchCashChart(values.YearToDate, leftScale.YearToDate, rightScale.YearToDate, gContent, g, gCheck);
            });

            this.drawRect(g, 0, 0, settings.width, settings.height, "none").attr("stroke", "#dedede").attr("pointer-events", "none");
        }
        , createDonut: function () {
            var that = this;
            var svg = d3.select("body").select("#" + settings.renderTo)
                              .attr("viewBox", "0 0 " + settings.width + " " + settings.height)
                .attr("preserveAspectRatio", "xMaxYMin meet")
                .attr("width", settings.width * settings.scale)
                .attr("height", settings.height * settings.scale);

            // define the doughnut chart shadow effect when mouseover on it
            var defs = svg.append("defs");
            var filter = defs.append("filter")
                .attr("id", settings.renderTo + "-drop-shadow")
                .attr("x", "0").attr("y", "0")
                .attr("width", "150%").attr("height", "150%");
            filter.append("feOffset")
                .attr("dx", "1")
                .attr("dy", "1")
                .attr("in", "SourceAlpha")
                .attr("result", "offOut");
            filter.append("feGaussianBlur")
                .attr("result", "blurOut")
                .attr("in", "offOut")
                .attr("stdDeviation", "1");
            filter.append("feBlend")
                .attr("in", "SourceGraphic")
                .attr("in2", "blurOut")
                .attr("mode", "normal");

            var g = svg.append("g").style("cursor", "default");//.attr("transform", "scale(0.5)");
            var data = this.applyTitle(g);
            var gQuar = data[0];
            var gYear = data[1];

            /*主要内容*/
            var shadow = that.drawRect(g, 11, 0, 8.5, 5, "black")
                            .attr("display", "none").attr("class", "shadow");//矩形的阴影（须在矩形前定义）
            var gPie = g.append("g").attr("class", "gPie");
            var gPie1 = g.append("g").attr("class", "gPie1");
            var gTxt = g.append("g");//饼图上方的文字Q315
            var gDesc = g.append("g").attr("class", "gDesc");

            //饼状图中间的文字
            var midTxt1 = g.append("text")
                .attr("x", "43")
                .attr("y", "66")
                .attr("font-size", 7)
                .attr("font-weight", "bold")
                .attr("class", "midTxt1")
                .style("text-anchor", "middle")
                .text("$" + d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0])).toFixed(settings.precision));

            var gMid = g.append("g").attr("fill", "gray").attr("font-size", 5).attr("class", "gMid");
            gMid.append("text").attr("x", "43").attr("y", "75").style("text-anchor", "middle").text("Total Company");
            gMid.append("text").attr("x", "43").attr("y", "81").style("text-anchor", "middle").text("Revenue");
            gMid.append("text").attr("x", "55").attr("y", "81").style("text-anchor", "middle").text("*").attr("fill", "red").attr("font-size", 6);

            var midTxt2 = g.append("text")
                .attr("x", "117")
                .attr("y", "66")
                .attr("font-size", 7)
                .attr("font-weight", "bold")
                .attr("class", "midTxt2")
                .style("text-anchor", "middle")
                .text("$" + d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1])).toFixed(settings.precision));

            var gMid2 = g.append("g").attr("fill", "gray").attr("font-size", 5).attr("class", "gMid2");
            gMid2.append("text").attr("x", "117").attr("y", "75").style("text-anchor", "middle").text("Total Company");
            gMid2.append("text").attr("x", "117").attr("y", "81").style("text-anchor", "middle").text("Revenue");
            gMid2.append("text").attr("x", "129").attr("y", "81").style("text-anchor", "middle").text("*").attr("fill", "red").attr("font-size", 6);

            //用来显示饼状图的比例
            var gShow = g.append("g").attr("class", "gShow");
            var gShow1 = g.append("g").attr("class", "gShow");

            gTxt.append("text").attr("font-size", 7)
                .attr("fill", "gray").attr("font-weight", "bold")
                .attr("x", 43).attr("y", 32)
                .attr("text-anchor", "middle")
                .text(labels.Quarterly[0]);
            gTxt.append("text").attr("font-size", 7).
                attr("fill", "gray")
                .attr("x", 117).attr("y", 32)
                .attr("text-anchor", "middle")
                .text(labels.Quarterly[1]);

            if (settings.defaultTab == "Quarterly") {
                bQuarterly = true;
                midTxt1.text("$" + d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0])).toFixed(settings.precision));
                midTxt2.text("$" + d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1])).toFixed(settings.precision));
                that.switchDonut("left", data[2], gTxt, [values.Quarterly, unallocatedValue.Quarterly], [gPie, gPie1], labels.Quarterly, gDesc, shadow, gShow, midTxt1, midTxt2, gMid, gMid2);
                that.switchSummary(g, labels.Quarterly, unallocatedValue.Quarterly);
            }
            else {
                bQuarterly = false;
                midTxt1.text("$" + d3.sum(values.YearToDate[0].concat(unallocatedValue.YearToDate[0])).toFixed(settings.precision));
                midTxt2.text("$" + d3.sum(values.YearToDate[1].concat(unallocatedValue.YearToDate[1])).toFixed(settings.precision));
                that.switchDonut("right", data[2], gTxt, [values.YearToDate, unallocatedValue.YearToDate], [gPie, gPie1], labels.YearToDate, gDesc, shadow, gShow, midTxt1, midTxt2, gMid, gMid2);
                that.switchSummary(g, labels.YearToDate, unallocatedValue.YearToDate);
            }

            that.drawLine(g, 5, settings.height - settings.footHeight, settings.width - 5, settings.height - settings.footHeight, "gray", "0.2");

            //最下方的描述信息
            var desc = gDesc.selectAll("g").data(settings.groupTitles).enter().append("g").style("cursor", "pointer");
            desc.append("rect").attr("width", 9).attr("height", 5.3)
                .attr("x", 10).attr("y", function (d, i) { return 114 + (7.3 * i); })
                .attr("fill", function (d, i) { return settings.color[i]; });
            desc.append("text").attr("x", 22).attr("y", function (d, i) { return 119 + (7.3 * i); }).attr("font-size", 4.6)
                .attr("fill", "black").text(function (d, i) { return d; });
            var descBg = desc.append("rect").attr("x", 10)
                .attr("y", function (d, i) { return 114 + (7.3 * i); })
                .attr("width", 95)
                .attr("height", 5.3)
                .attr("fill", "transparent");

            desc.each(function () {
                var rect = d3.select(this).select("rect:nth-of-type(2)");
                //rect.attr("width", d3.select(this).node().getBBox().width + 5);
                rect.on("mouseover", function () {
                    var rect = d3.select(this.parentNode).select("rect");
                    var text = d3.select(this.parentNode).select("text");
                    var y = rect.attr("y");
                    var color = rect.attr("fill");
                    var xTxt = text.attr("x");
                    var yTxt = text.attr("y");
                    shadow.attr("display", "block").attr("y", parseInt(y) + 1);
                    text.attr("x", parseInt(xTxt) - 1).attr("y", parseInt(yTxt) - 1);

                    gPie.selectAll("g").each(function () {
                        var sumValue;
                        if (!bQuarterly) {
                            //sumValue = d3.sum(values.YearToDate[0]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.YearToDate[0].concat(unallocatedValue.YearToDate[0]));
                        }
                        else {
                            //sumValue = d3.sum(values.Quarterly[0]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0]));
                        }
                        that.mouseoverDesc(d3.select(this), color, midTxt1, text, gMid, gShow, 43, sumValue);
                    });
                    gPie1.selectAll("g").each(function () {
                        var sumValue;
                        if (!bQuarterly) {
                            //sumValue = d3.sum(values.YearToDate[1]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.YearToDate[1].concat(unallocatedValue.YearToDate[1]));
                        }
                        else {
                            //sumValue = d3.sum(values.Quarterly[1]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1]));
                        }
                        that.mouseoverDesc(d3.select(this), color, midTxt2, text, gMid2, gShow1, 117, sumValue);//103,175/298,175饼心坐标

                    });
                }).on("mouseout", function () {
                    that.mouseoutDescForTouch(d3.select(this.parentNode), shadow, gPie, gPie1, gMid, gMid2, midTxt1, midTxt2);
                })
                .on("touchstart", function () {
                    event.preventDefault();
                    d3.event.stopPropagation();
                    //先把之前的效果归位
                    that.mouseoutDescForTouch(desc, shadow, gPie, gPie1, gMid, gMid2, midTxt1, midTxt2);

                    var rect = d3.select(this.parentNode).select("rect");
                    var text = d3.select(this.parentNode).select("text");
                    var y = rect.attr("y");
                    var color = rect.attr("fill");
                    var xTxt = text.attr("x");
                    var yTxt = text.attr("y");
                    shadow.attr("display", "block").attr("y", parseInt(y) + 1);
                    text.attr("x", parseInt(xTxt) - 1).attr("y", parseInt(yTxt) - 1);

                    gPie.selectAll("g").each(function () {
                        var sumValue;
                        if (!bQuarterly) {
                            //sumValue = d3.sum(values.YearToDate[0]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.YearToDate[0].concat(unallocatedValue.YearToDate[0]));
                        }
                        else {
                            //sumValue = d3.sum(values.Quarterly[0]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0]));
                        }
                        that.mouseoverDesc(d3.select(this), color, midTxt1, text, gMid, gShow, 43, sumValue);
                    });
                    gPie1.selectAll("g").each(function () {
                        var sumValue;
                        if (!bQuarterly) {
                            //sumValue = d3.sum(values.YearToDate[1]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.YearToDate[1].concat(unallocatedValue.YearToDate[1]));
                        }
                        else {
                            //sumValue = d3.sum(values.Quarterly[1]);//.toFixed(settings.precision);
                            sumValue = d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1]));
                        }
                        that.mouseoverDesc(d3.select(this), color, midTxt2, text, gMid2, gShow1, 117, sumValue);//103,175/298,175饼心坐标
                    });
                });
            });

            that.drawRect(gShow, 0, 0, 18, 8, "black").attr("rx", 5).attr("ry", 5).attr("display", "none");
            that.drawText(gShow, 9, 6, "22%", 4.5, "white").attr("font-weight", "bold").attr("text-anchor", "middle").attr("display", "none");
            that.drawRect(gShow1, 0, 0, 18, 8, "black").attr("rx", 5).attr("ry", 5).attr("display", "none");
            that.drawText(gShow1, 9, 6, "22%", 4.5, "white").attr("font-weight", "bold").attr("text-anchor", "middle").attr("display", "none");

            /*添加gQuar的click事件*/
            gQuar.on("click", function () {
                bQuarterly = true;
                midTxt1.text("$" + d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0])).toFixed(settings.precision));
                midTxt2.text("$" + d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1])).toFixed(settings.precision));
                that.switchDonut("left", data[2], gTxt, [values.Quarterly, unallocatedValue.Quarterly], [gPie, gPie1], labels.Quarterly, gDesc, shadow, gShow, midTxt1, midTxt2, gMid, gMid2);
                that.switchSummary(g, labels.Quarterly, unallocatedValue.Quarterly);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                bQuarterly = true;
                that.mouseoutDescForTouch(desc, shadow, gPie, gPie1, gMid, gMid2, midTxt1, midTxt2);
                that.switchDonut("left", data[2], gTxt, [values.Quarterly, unallocatedValue.Quarterly], [gPie, gPie1], labels.Quarterly, gDesc, shadow, gShow, midTxt1, midTxt2, gMid, gMid2);
                that.switchSummary(g, labels.Quarterly, unallocatedValue.Quarterly);
            });
            /*添加gYear的click事件*/
            gYear.on("click", function () {
                bQuarterly = false;
                midTxt1.text("$" + d3.sum(values.YearToDate[0].concat(unallocatedValue.YearToDate[0])).toFixed(settings.precision));
                midTxt2.text("$" + d3.sum(values.YearToDate[1].concat(unallocatedValue.YearToDate[1])).toFixed(settings.precision));
                that.switchDonut("right", data[2], gTxt, [values.YearToDate, unallocatedValue.YearToDate], [gPie, gPie1], labels.YearToDate, gDesc, shadow, gShow, midTxt1, midTxt2, gMid, gMid2);
                that.switchSummary(g, labels.YearToDate, unallocatedValue.YearToDate);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                bQuarterly = false;
                that.mouseoutDescForTouch(desc, shadow, gPie, gPie1, gMid, gMid2, midTxt1, midTxt2);
                that.switchDonut("right", data[2], gTxt, [values.YearToDate, unallocatedValue.YearToDate], [gPie, gPie1], labels.YearToDate, gDesc, shadow, gShow, midTxt1, midTxt2, gMid, gMid2);
                that.switchSummary(g, labels.YearToDate, unallocatedValue.YearToDate);
            });

            this.drawRect(g, 0, 0, settings.width, settings.height, "none").attr("stroke", "#dedede").attr("pointer-events", "none");
        }
        , createBarSegment: function () {
            var that = this;
            var svg = d3.select("body").select("#" + settings.renderTo)
                           .attr("viewBox", "0 0 " + settings.width + " " + settings.height)
                .attr("preserveAspectRatio", "xMaxYMin meet")
                .attr("width", settings.width * settings.scale)
                .attr("height", settings.height * settings.scale);
            var g = svg.append("g").style("cursor", "default");//.attr("transform", "scale(0.5)");
            var data = this.applyTitle(g);
            var gQuar = data[0];
            var gYear = data[1];

            //横轴分割线，横轴上的文字
            var gTxtAxis = this.applyAxisAndText(g);

            //Y轴分割线，柱子，柱子上的文字
            var gContent = g.append("g").attr("font-size", 12).attr("fill", "gray");
            if (settings.defaultTab == "Quarterly") {
                this.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, null, 4.5, 123, 6);
                that.drawDoubleBar(leftRange.Quarterly, leftScale.Quarterly, values.Quarterly, gContent, g);
            }
            else {
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, null, 4.5, 123, 6);
                that.drawDoubleBar(leftRange.YearToDate, leftScale.YearToDate, values.YearToDate, gContent, g);
            }

            that.drawRect(g, 0, settings.height - 28, settings.width, 28, "#f0f0f0");
            var gfoot = g.append("g").attr("font-size", 4.8).attr("fill", "gray");
            that.applyBarSegmentFoot(gfoot);

            /*添加gQuar的click事件*/
            gQuar.on("click", function () {
                that.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, null, 4.5, 123, 6);
                that.drawDoubleBar(leftRange.Quarterly, leftScale.Quarterly, values.Quarterly, gContent, g);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.changeBarCommon("left", data[2], [leftRange.Quarterly], labels.Quarterly, gTxtAxis, gContent, null, 4.5, 123, 6);
                that.drawDoubleBar(leftRange.Quarterly, leftScale.Quarterly, values.Quarterly, gContent, g);
            });
            /*添加gAnnual的click事件*/
            gYear.on("click", function () {
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, null, 4.5, 123, 6);
                that.drawDoubleBar(leftRange.YearToDate, leftScale.YearToDate, values.YearToDate, gContent, g);
                IR.Common.addWebTrends(settings.title, "ChangeTab");
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.changeBarCommon("right", data[2], [leftRange.YearToDate], labels.YearToDate, gTxtAxis, gContent, null, 4.5, 123, 6);
                that.drawDoubleBar(leftRange.YearToDate, leftScale.YearToDate, values.YearToDate, gContent, g);
            });

            this.drawRect(g, 0, 0, settings.width, settings.height, "none").attr("stroke", "#dedede").attr("pointer-events", "none");
        }
        , applyTitle: function (gTar) {
            var that = this;
            //画背景的颜色渐变
            var linearGradient = gTar.append("linearGradient").attr("id", "bgcolor" + settings.renderTo).attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
            linearGradient.append("stop").attr("offset", "0%").style("stop-color", "#fff");
            linearGradient.append("stop").attr("offset", "100%").style("stop-color", "#ececec");

            // current quarter/ytd column bg color
            var linearGradientCurr = gTar.append("linearGradient").attr("id", "currbgcolor" + settings.renderTo).attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
            linearGradientCurr.append("stop").attr("offset", "0%").style("stop-color", "#fff");
            linearGradientCurr.append("stop").attr("offset", "50%").style("stop-color", "#fefefe");
            linearGradientCurr.append("stop").attr("offset", "100%").style("stop-color", "#f6f6f6");

            this.drawRect(gTar, 0, 0, settings.width, settings.height, "white");

            //var element = d3.select("body").select("#" + settings.renderTo);
            //var oriViewBox = element.attr("viewBox"), zoomViewBox = "";
            //var pined = false;

            //if (oriViewBox) {
            //    var vbArray = oriViewBox.split(" ");
            //    if (vbArray.length == 4)
            //        zoomViewBox = vbArray[0] + " " + vbArray[1] + " " + vbArray[2] + " " + (vbArray[3] * settings.scale).toFixed(2);
            //}

            //头部
            this.drawRect(gTar, 0, 0, settings.width, settings.titleHeight, "#f0f0f0");
            var fixed = gTar.append("g").attr("fill", "#b5b5b5").attr("class", "gFixed").style("cursor", "pointer");
            this.drawCircle(fixed, settings.width - 6, 5, 4, "white", "#b5b5b5", 0.5).attr("fill-opacity", 0);
            // draw the pin button
            var pin = fixed.append("path").attr("transform", "translate(151.6,2.4) scale(0.01)").attr("d", "M512,179.197L332.893,0c-9.291,9.125-16.225,19.195-20.788,30.217c-4.549,11.021-6.837,22.297-6.837,33.828"
                + "c0,11.358,2.288,22.545,6.893,33.573l-111.81,111.713c-9.401-4.866-19.175-8.533-29.335-10.993"
                + "c-10.152-2.461-20.464-3.694-30.926-3.694c-16.453,0-32.374,2.978-47.759,8.939c-15.391,5.962-29.127,14.949-41.21,26.983"
                + "l95.261,95.02l-61.143,70.372L39.37,451.566l-29.004,38.694c-6.741,9.953-10.111,16.501-10.111,19.63L0,511.242l0.51,0.248v0.841"
                + "l0.503-0.593l1.089,0.248c3.129,0,9.677-3.309,19.637-9.939l38.695-28.824l55.608-46.041l70.716-61.233l94.676,94.924"
                + "c12.089-12.076,21.091-25.819,27.032-41.203c5.927-15.398,8.891-31.278,8.891-47.683c0-10.504-1.227-20.843-3.652-30.961"
                + "c-2.427-10.132-6.121-19.933-11.028-29.376l111.713-111.72c11.015,4.535,22.208,6.803,33.566,6.803"
                + "c11.594,0,22.869-2.288,33.87-6.844C492.825,195.325,502.874,188.434,512,179.197z");
            if (settings.chartType == "barsegment") {
                pin.attr("transform", "translate(191.5,2.4) scale(0.01)");
            }

            if (settings.subTitle.length > 15) {
                this.drawText(gTar, 3, 8.5, settings.title, 5.5, "black").attr("font-weight", "bold");
                this.drawText(gTar, 3, 14, settings.subTitle, 4.5, "gray");
            }
            else {
                var marginTop = 9;
                // if (settings.chartType == "doughnut") {
                //     marginTop = 9;
                // }
                var title = this.drawText(gTar, 4, marginTop, settings.title, 5.5, "black").attr("font-weight", "bold");
                var width = title.node().getBBox().width;
                this.drawText(gTar, 4 + width + 1, marginTop, settings.subTitle, 4.5, "gray");
            }

            var windowWidth = $(window).width();
            if (windowWidth < 663) {
                fixed.attr("display", "none");
            }
            else {
                fixed.attr("display", "block");
            }

            var oriViewBox = "0 0 " + settings.width + " " + settings.height;
            //svg的缩放事件
            //gTar.on("mouseover", function () {
            //    var width = $(window).width();
            //    if (width < 663) {
            //        d3.select("body").select("#" + settings.renderTo).style("z-index", 101);
            //        fixed.attr("display", "none");
            //    }
            //    else {
            //        fixed.attr("display", "block");
            //        if (!pined)
            //            d3.select("body").select("#" + settings.renderTo).transition().duration(300).ease("linear")
            //                .attr("width", settings.width * 2.5)
            //                .attr("height", settings.height * 2.5)
            //                .style("margin-left", (settings.width * (settings.scale - 2.5)) + "px")
            //                .style("z-index", 100);
            //        else d3.select("body").select("#" + settings.renderTo).style("z-index", 101);
            //    }
            //}).on("mouseout", function () {
            //    var width = $(window).width();
            //    if (width < 663) {
            //        d3.select("body").select("#" + settings.renderTo).style("z-index", 100);
            //        fixed.attr("display", "none");
            //    }
            //    else {
            //        fixed.attr("display", "block");
            //        if (!pined)
            //            d3.select("body").select("#" + settings.renderTo).transition().duration(100)
            //                .attr("width", settings.width * settings.scale)
            //                .attr("height", settings.height * settings.scale)
            //                .style("margin-left", "0px")
            //                .each("end", function () { d3.select(this).style("z-index", 0); });
            //        else d3.select("body").select("#" + settings.renderTo).style("z-index", 100);
            //    }
            //});

            var start_x;
            var start_y;
            var end_x;
            var end_y;
            var ifTouchStart = false;
            gTar.on("touchstart", function () {
                start_x = d3.touches(this)[0][0];
                start_y = d3.touches(this)[0][1];
                end_x = 0;
                end_y = 0;
                ifTouchStart = true;
            })
            .on("touchmove", function () {
                end_x = d3.touches(this)[0][0];
                end_y = d3.touches(this)[0][1];
            })
            .on("touchend", function () {
                if (ifTouchStart) {
                    var diff_x = start_x - end_x;
                    var diff_y = start_y - end_y;
                    //check if the click event
                    if (end_x == 0 || end_y == 0 || Math.abs(diff_x) == 0 || Math.abs(diff_y) == 0) {
                        var width = $(window).width();
                        if (width >= 663) {
                            event.preventDefault();
                            d3.event.stopPropagation();
                            if (settings.chartType == "doughnut") {
                                var desc = gTar.select(".gDesc").selectAll("g");
                                var shadow = gTar.select(".shadow");
                                var gPie = gTar.select(".gPie");
                                var gPie1 = gTar.select(".gPie1");
                                var gMid = gTar.select(".gMid");
                                var gMid2 = gTar.select(".gMid2");
                                var midTxt1 = gTar.select(".midTxt1");
                                var midTxt2 = gTar.select(".midTxt2");
                                that.mouseoutDescForTouch(desc, shadow, gPie, gPie1, gMid, gMid2, midTxt1, midTxt2);
                            }
                            else if (settings.chartType == "barsegment") {
                                var showRect = gTar.select(".showRect");
                                var showText = gTar.select(".showText");
                                var gBarsRects = gTar.selectAll(".gBarsRects");
                                that.mouseOutForDoubleBar(gBarsRects, showRect, showText);
                            }
                            else {
                                var showRect = gTar.select(".showRect");
                                var showText = gTar.select(".showText");
                                var gBars = gTar.select(".bar").selectAll("g");
                                that.barMouseoutForTouch(gBars, showRect, showText);
                            }

                            if (pined) {
                                pined = !pined;
                                fixed.attr("fill", "#b5b5b5");
                                fixed.select("circle").attr("stroke", "#b5b5b5");
                                d3.select("body").select("#" + settings.renderTo).transition().duration(100)
                                        .attr("width", settings.width * settings.scale)
                                        .attr("height", settings.height * settings.scale)
                                        .style("margin-left", "0px")
                                        .each("end", function () { d3.select(this).style("z-index", 0); });
                            }
                            else {
                                pined = !pined;
                                fixed.attr("fill", "#7a7a7a");
                                fixed.select("circle").attr("stroke", "#7a7a7a");
                                d3.select("body").select("#" + settings.renderTo).transition().duration(300).ease("linear")
                                        .attr("width", settings.width * 2.5)
                                        .attr("height", settings.height * 2.5)
                                        .style("margin-left", (settings.width * (settings.scale - 2.5)) + "px")
                                        .style("z-index", 100);
                            }
                        }
                    }
                    ifTouchStart = false;
                }
            });

            /*add click event for fixed*/
            fixed.on("click", function () {
                //event.preventDefault();
                d3.event.stopPropagation();

                if (d3.select(this).attr("fill") == "#b5b5b5" || pined == false) {
                    pined = true;
                    d3.select(this).attr("fill", "#7a7a7a");
                    d3.select(this).select("circle").attr("stroke", "#7a7a7a");
                    IR.Common.addWebTrends(settings.title, "Dock chart");
                }
                else {
                    pined = false;
                    d3.select(this).attr("fill", "#b5b5b5");
                    d3.select(this).select("circle").attr("stroke", "#b5b5b5");
                    IR.Common.addWebTrends(settings.title, "Undock chart");
                }
            });

            // draw the navigation bar
            var gNavBar = gTar.append("g");
            this.drawRect(gNavBar, 0, settings.titleHeight, settings.width, settings.tabHeight, "#7e7e7e");//.attr("stroke", "#7e7e7e");

            var gQuar = gNavBar.append("g");
            this.drawRect(gQuar, 0, settings.titleHeight, settings.tabWidth, settings.tabHeight, "#7e7e7e");//.attr("stroke", "#ffffff");

            var gYear = gNavBar.append("g");
            this.drawRect(gYear, settings.tabWidth, settings.titleHeight, settings.tabWidth, settings.tabHeight, "#7e7e7e");//.attr("stroke", "#7e7e7e");

            var bgrect = this.drawRect(gNavBar, 0, settings.titleHeight, settings.tabWidth, settings.tabHeight + 1, "#fff")
                .attr("class", "bgrect").attr("pointer-events", "none");
            var qtext = this.drawText(gNavBar, 10, settings.titleHeight + settings.tabHeight - 3, settings.tabLabel[0], 5, "#7e7e7e")
                .attr("pointer-events", "none");
            var ytext = this.drawText(gNavBar, settings.tabWidth + 10, settings.titleHeight + settings.tabHeight - 3, settings.tabLabel[1], 5, "#fff")
                .attr("pointer-events", "none");
            if (settings.defaultTab != "Quarterly") {
                bgrect.attr("transform", "translate(50,0)");
                qtext.attr("fill", "#fff");
                ytext.attr("fill", "#7e7e7e");
            }

            if (settings.chartType == "barsegment") {
                this.drawRect(gTar, 0, settings.titleHeight + settings.tabHeight, settings.width, settings.height - settings.titleHeight - settings.tabHeight - 28, "url(#bgcolor" + settings.renderTo + ")");
            }
            else {
                this.drawRect(gTar, 0, settings.titleHeight + settings.tabHeight, settings.width, settings.height - settings.titleHeight - settings.tabHeight, "url(#bgcolor" + settings.renderTo + ")");
            }
            //tooltip for pin
            var gTooltip = gTar.append("g").attr("display", "none");
            var tooltipRect = this.drawRect(gTooltip, 110, 15, 48, 6, "white").attr("stroke", "black").attr("stroke-width", 0.2).attr("rx", 3).attr("ry", 4);
            var tooltipText = this.drawText(gTooltip, 134, 19, "Click to dock chart", 4, "black").attr("text-anchor", "middle");
            if (settings.chartType == "barsegment") {
                tooltipRect.attr("x", 150);
                tooltipText.attr("x", 174);
            }

            /*add mousemove event for fixed*/
            fixed.on("mousemove", function () {
                gTooltip.attr("display", "block");
                var y = d3.mouse(this)[1];
                tooltipRect.attr("y", y + 8);
                tooltipText.attr("y", (y + 4.5) + 8);
                if (d3.select(this).attr("fill") == "#b5b5b5" || pined == false) {
                    tooltipText.text("Click to dock chart");
                }
                else {
                    tooltipText.text("Click to undock chart");
                }
            }).on("mouseout", function () {
                gTooltip.attr("display", "none");
            });

            return [gQuar, gYear, gNavBar];
        }
        , applyAxisAndText: function (gTar) {
            //横轴分割线，横轴上的文字
            var glTxtAxis = gTar.append("g").attr("font-size", 6).attr("fill", settings.labcolor).attr("font-weight", "bold");
            var grTxtAxis = null;
            if (rightRange != null && rightRange.Quarterly != null && rightRange.Quarterly != undefined && rightRange.Quarterly.length > 0) {
                grTxtAxis = gTar.append("g").attr("font-size", 6).attr("fill", settings.labcolor).attr("font-weight", "bold");
            }
            for (var i = 0; i < settings.yAxisCount; i++) {
                var _y = parseInt(leftScale.Quarterly(leftRange.Quarterly[i]));
                gTar.append("line").attr("x1", 2).attr("x2", settings.width - 2)
                    .attr("y1", _y).attr("y2", _y)
                    .attr("stroke", settings.linecolor)
                    .attr("stroke-width", 0.5);
                glTxtAxis.append("text").attr("x", 2).attr("y", _y - 2).text("$" + leftRange.Quarterly[i]);
                if (grTxtAxis != null) {
                    grTxtAxis.append("text").attr("x", 142).attr("y", _y - 2).text("$" + rightRange.Quarterly[i]);
                }
            }
            if (grTxtAxis == null) {
                return [glTxtAxis];
            }
            else {
                return [glTxtAxis, grTxtAxis];
            }
        }
        , changeBarCommon: function (moveto, gNavBar, rangeTxt, xText, gTxtAxis, gContent, currentRect, fontsize, ytxt, lineCount) {
            fontsize = (fontsize == null) ? 5 : fontsize;//双柱图时字体不同
            ytxt = (ytxt == null) ? 110 : ytxt;//双柱图时横坐标上字的高度不同110
            var padding = (ytxt == null) ? 3 : 1;
            lineCount = (lineCount == null) ? 2 : lineCount;//画一条，画yline.length条

            var qTxt = gNavBar.select("text");
            var yTxt = gNavBar.selectAll("text:nth-of-type(2)");
            var bgrect = gNavBar.select(".bgrect");
            //rect white   text gray
            if (moveto == "left") {
                if (qTxt.attr("fill") != "#7e7e7e") {
                    bgrect.transition().duration(300)
                        .attr("transform", "translate(0,0)")
                        .each("end", function () {
                            qTxt.attr("fill", "#7e7e7e");
                            yTxt.attr("fill", "#fff");
                        });
                }

            }
            else {
                if (yTxt.attr("fill") != "#7e7e7e") {
                    bgrect.transition().duration(300)
                        .attr("transform", "translate(50,0)")
                        .each("end", function () {
                            qTxt.attr("fill", "#fff");
                            yTxt.attr("fill", "#7e7e7e");
                        });
                }
            }
            //改gTxtAxis的data为
            for (var i = 0; i < gTxtAxis.length; i++) {
                gTxtAxis[i].selectAll("text").data(rangeTxt[i]).text(function (d, i) { return "$" + d; });
            }

            //改gContent的line和text
            gContent.selectAll("line").remove();
            gContent.selectAll("text").remove();
            gContent.selectAll("g").remove();

            var scale = this.xScale(xText.length);
            if (lineCount == 2) {
                gContent.append("line").attr("stroke", settings.linecolor).attr("y1", settings.yStart - 7)
                    .attr("y2", settings.height - settings.footHeight + 7)
                    .attr("x1", scale(xText.length))
                    .attr("x2", scale(xText.length))
                    .attr("stroke-width", 0.5);
                gContent.append("line").attr("stroke", settings.linecolor).attr("y1", settings.yStart - 7)
                    .attr("y2", settings.height - settings.footHeight + 7)
                    .attr("x1", scale(xText.length + 1))
                    .attr("x2", scale(xText.length + 1))
                    .attr("stroke-width", 0.5);
                if (currentRect != null) {
                    currentRect[0].attr("x", scale(xText.length) + 0.5).attr("y", settings.yStart - 7).attr("width", scale(2) - scale(1))
                        .attr("height", settings.height - settings.footHeight - settings.yStart + 14);//设置当前Q或FY背景rect的位置
                }
            }
                //barversus
            else if (lineCount == 4) {
                var arr = [2, 5, 3, 6];
                for (var i = 0; i < 4; i++) {
                    gContent.append("line").attr("stroke", settings.linecolor)
                        .attr("y1", settings.yStart - 7)
                        .attr("y2", settings.height - settings.footHeight + 4)
                        .attr("x1", scale(arr[i]))
                        .attr("x2", scale(arr[i]))
                        .attr("stroke-width", 0.5);
                }
                if (currentRect != null) {
                    for (var i = 0; i < 2; i++) {
                        currentRect[i].attr("x", scale(arr[i]))
                            .attr("y", settings.yStart - 7)
                            .attr("width", scale(2) - scale(1))
                            .attr("height", settings.height - settings.footHeight - settings.yStart + 14);//设置当前Q或FY背景rect的位置
                    }
                }
            }
            else {
                gContent.selectAll("line").data(xText).enter().append("line")
                    .attr("stroke", settings.linecolor)
                    .attr("stroke-width", 0.5)
                    .attr("y1", settings.yStart - 7)
                    .attr("y2", settings.height - settings.footHeight + 15)
                    .attr("x1", function (d, i) { return scale(i + 2); })
                    .attr("x2", function (d, i) { return scale(i + 2); });
            }

            var cellWidth = scale(2) - scale(1);
            var gYText = gContent.append("g").attr("font-size", fontsize);
            for (var i = 0; i < xText.length; i++) {
                gYText.append("text").attr("y", ytxt).attr("x", scale(i + 1) + cellWidth / 2).text(xText[i]).attr("text-anchor", "middle");
            }
            //  IR.Common.addWebTrends(settings.title, "ChangeTab");

        }
        //画对比的箭头
        , drawBarVersus: function (bar, dataSet) {
            var bar2 = bar.selectAll("g:nth-of-type(2)").select("rect").attr("fill", "#0072c5"); // the first blue bar
            var bar5 = bar.selectAll("g:nth-of-type(5)").select("rect").attr("fill", "#0072c5"); // the second blue bar

            var gTarget = bar.selectAll("g:nth-of-type(3)"); // the first arrow
            var x = gTarget.select("rect").attr("x") - 3;
            gTarget.select("rect").remove();
            gTarget.select("text").remove();

            var scale = parseInt(dataSet[0] * 100);

            var path = gTarget.append("path")
                .attr("transform", "translate(" + x + ",45) scale(0.52)")
                .attr("fill", "#339900");
            var text = gTarget.append("text")
                .attr("x", x + 6)
                .attr("y", 58)
                .attr("font-weight", "bold")
                .attr("font-size", "5.5")
                .attr("fill", "white")
                .text((scale >= 100) ? "*" : (scale >= 0) ? (scale.toString() + "%") : ("(" + -scale.toString() + "%)"));

            if (dataSet[0] > 0) {
                path.attr("d", "M20 0 L0 18 L6 18 L6 36 L34 36 L34 18 L40 18 Z").attr("fill", "#339900");
            }

            else if (dataSet[0] < 0 || dataSet[0].indexOf("-") >= 0) {
                path.attr("d", "M6 0 L6 18 L0 18 L20 36 L40 18 L34 18 L34 0 Z").attr("fill", "#E81123");
                text.attr("y", 55).attr("x", x + 3);
            }
            else {
                //画向右灰色的箭头
                path.attr("d", "M20 0 L0 18 L6 18 L6 36 L34 36 L34 18 L40 18 Z").attr("fill", "gray")
                    .attr("transform", "translate(" + (x + 21) + ",60) scale(0.53) rotate(90) ");
                text.attr("y", 72).attr("x", x + 6);
            }

            var box = gTarget.node().getBBox();
            var _rect = text.node().getBBox();
            var x_fix = box.x + box.width / 2 - _rect.width / 2;
            text.attr("x", x_fix);

            var gTarget1 = bar.selectAll("g:nth-of-type(6)"); // the second arrow
            var x1 = gTarget1.select("rect").attr("x") - 3;
            gTarget1.select("rect").remove();
            gTarget1.select("text").remove();

            var scale1 = parseInt(dataSet[1] * 100);

            var path1 = gTarget1.append('path')
                .attr("transform", "translate(" + x1 + ",65) scale(0.52)");
            text = gTarget1.append("text")
                .attr("x", x1 + 6)
                .attr("y", 78)
                .attr("font-weight", "bold")
                .attr("font-size", "6")
                .attr("fill", "white")
                .text((scale1 >= 100) ? "*" : (scale1 >= 0) ? (scale1.toString() + "%") : ("(" + -scale1.toString() + "%)"));
            if (dataSet[1] > 0) {
                path1.attr("d", "M20 0 L0 18 L6 18 L6 36 L34 36 L34 18 L40 18 Z").attr("fill", "#339900");
            }
            else if (dataSet[1] < 0 || dataSet[1].indexOf("-") >= 0) {
                path1.attr("d", "M6 0 L6 18 L0 18 L20 36 L40 18 L34 18 L34 0 Z").attr("fill", "#E81123");
                text.attr("y", 75).attr("x", x1 + 3);
            }
            else {
                //画向右灰色的箭头
                path1.attr("d", "M20 0 L0 18 L6 18 L6 36 L34 36 L34 18 L40 18 Z").attr("fill", "gray")
                    .attr("transform", "translate(" + (x1 + 21) + ",60) scale(0.53) rotate(90) ");
                text.attr("y", 72).attr("x", x1 + 6);
            }

            box = gTarget1.node().getBBox();
            _rect = text.node().getBBox();
            x_fix = box.x + box.width / 2 - _rect.width / 2;
            text.attr("x", x_fix);

            if (scale > 0) {
                gTarget.select("path").transition().duration(1000).ease("linear").delay(1000).attr("transform", "translate(" + x + ",40) scale(0.52)")
                    .transition().duration(1000).ease("linear").attr("transform", "translate(" + x + ",45) scale(0.52)")
                    .transition().duration(1000).ease("linear").attr("transform", "translate(" + x + ",40) scale(0.52)")
                    .transition().duration(1000).ease("linear").attr("transform", "translate(" + x + ",45) scale(0.52)");
                gTarget.select("text").transition().duration(1000).ease("linear").delay(1000).attr("y", 53)
                    .transition().duration(1000).ease("linear").attr("y", 58)
                    .transition().duration(1000).ease("linear").attr("y", 53)
                    .transition().duration(1000).ease("linear").attr("y", 58)
                    .each("end", function () {
                        d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                    });
            }
            if (scale1 > 0) {
                gTarget1.select("path").transition().duration(1000).ease("linear").delay(1000).attr("transform", "translate(" + x1 + ",60) scale(0.52)")
                    .transition().duration(1000).ease("linear").attr("transform", "translate(" + x1 + ",65) scale(0.52)")
                    .transition().duration(1000).ease("linear").attr("transform", "translate(" + x1 + ",60) scale(0.52)")
                    .transition().duration(1000).ease("linear").attr("transform", "translate(" + x1 + ",65) scale(0.52)");
                gTarget1.select("text").transition().duration(1000).ease("linear").delay(1000).attr("y", 73)
                    .transition().duration(1000).ease("linear").attr("y", 78)
                    .transition().duration(1000).ease("linear").attr("y", 73)
                    .transition().duration(1000).ease("linear").attr("y", 78)
                    .each("end", function () {
                        d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                    });
            }
            if (scale <= 0 && scale1 <= 0) {
                setTimeout(function () {
                    d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                }, 1500);
            }

        }
        , xScale: function (n) {
            var xStart = (n == 2) ? 35 : (n == 3) ? 35 : (n == 5) ? 33 : 23;
            if (settings.chartType == "barsegment" && n == 3) {
                xStart = 28;
            }
            var scale = d3.scale.linear()
                .domain([1, n + 1])
                .range([xStart, settings.width - 2]);
            if (settings.chartType == "cash") {
                xStart = 15;
                scale = d3.scale.linear()
                    .domain([1, n + 1])
                    .range([xStart, settings.width - 20]);
            }

            return scale;
        }
        , switchBar: function (barSet, yScale, gContent, g, showRect, showText) {
            showRect.attr("display", "none");
            showText.attr("display", "none");

            //重画柱子
            var that = this;
            var barwidth = 14;
            var xScale = this.xScale(barSet.length);
            var cellWidth = xScale(2) - xScale(1);
            var padding = parseInt((cellWidth - barwidth) / 2);

            var bar = gContent.append("g").attr("class", "bar");
            var gBars = bar.selectAll("g").data(barSet).enter().append("g");

            var barRect = gBars.data(barSet).append("rect").attr("x", function (d, i) { return xScale(i + 1) + padding; })
            //.attr("y", settings.height - settings.footHeight).attr("width", 35).attr("height", 0)
                .attr("y", yScale(0)).attr("width", barwidth).attr("height", 0)
                .attr("fill", function (d, i) {
                    if (i == barSet.length - 1) {
                        return "#0072c5";
                    }
                    else {
                        return "#00b193";
                    }
                })
                .style("cursor", "pointer")
                .transition().duration(1000).ease("linear")
            //.attr("y", function (d, i) { return yScale(d); })
            //.attr("height", function (d, i) { return settings.height - settings.footHeight - yScale(d); });
                .attr("y", function (d, i) {
                    var value = parseFloat(d).toFixed(settings.precision);
                    if (d < 0) {
                        return yScale(0);
                    }
                    else {
                        if (value == 0) return yScale(0.01);
                        else return yScale(d);
                    }
                })
                .attr("height", function (d, i) {
                    var value = parseFloat(d).toFixed(settings.precision);
                    if (value == 0) {
                        return Math.abs(yScale(0.01) - yScale(0));
                    }
                    else
                        return Math.abs(yScale(d) - yScale(0));
                })
                .each("end", function () {
                    if (settings.chartType == "bar" || settings.chartType == "epsbar") {
                        d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                    }
                });

            var barText = gBars.data(barSet).append("text").attr("x", function (d, i) { return xScale(i + 1) + cellWidth / 2 - 1; })
            //.attr("y", function (d, i) { return yScale(d) - 8; })
                .attr("y", function (d, i) {
                    if (d < 0) return yScale(d) + 8;
                    return yScale(d) - 3;
                })
                .attr("font-weight", "bold")
                .attr("fill", settings.labcolor).attr("class", "txtbar").attr("text-anchor", "middle").attr("display", "none")
                .transition().duration(500).delay(1000)
                .attr("display", "block").text(function (d, i) {
                    var value = parseFloat(d).toFixed(settings.precision);
                    if (d < 0) {
                        if (value == 0) {
                            if (settings.precision == 0) {
                                return "$0";
                            }
                            else if (settings.precision == 1) {
                                return "$0.0";
                            }
                            else if (settings.precision == 2) {
                                return "$0.00";
                            }
                        }
                        else {
                            return "$" + parseFloat(d).toFixed(settings.precision);
                        }
                    }
                    else {
                        return "$" + parseFloat(d).toFixed(settings.precision);
                    }
                });

            gBars.selectAll("rect").on("mousemove", function () {
                that.barMouseover(d3.select(this.parentNode), showRect, showText);
            }).on("mouseout", function () {
                that.barMouseout(d3.select(this.parentNode), showRect, showText);
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.barMouseoutForTouch(gBars, showRect, showText);
                that.barMouseover(d3.select(this.parentNode), showRect, showText);
            });
            return bar;
        }

        , switchCashChart: function (dataSet, leftScale, rightScale, gContent, g, gCheck) {
            var that = this;
            var bar = gContent.append("g").attr("class", "bar");

            var flag = 1;
            var value = dataSet[0];
            var value1 = dataSet[1];
            var arry = "";
            gCheck.selectAll(".check").each(function () {
                arry = arry + d3.select(this).attr("fill") + ",";
            });
            arry = arry.substring(0, arry.length - 1);
            arry = arry.split(",");
            if (arry[0] == "white")
                flag = 0;
            if (arry[1] == "white")
                value1 = null;
            if (arry[2] == "white")
                value = null;
            this.applyCashBar(value, value1, dataSet[2], leftScale, rightScale, bar, g, flag);


            gCheck.selectAll("g").each(function () {
                d3.select(this).on("click", function () {
                    var flag = 1;
                    var value = dataSet[0];
                    var value1 = dataSet[1];
                    var tarRect = d3.select(this).select(".check");
                    if (tarRect.attr("fill") == "white")
                        tarRect.attr("fill", "gray");
                    else
                        tarRect.attr("fill", "white");
                    var arry = "";
                    gCheck.selectAll(".check").each(function () {
                        arry = arry + d3.select(this).attr("fill") + ",";
                    });
                    arry = arry.substring(0, arry.length - 1);
                    arry = arry.split(",");
                    if (arry[0] == "white")
                        flag = 0;
                    if (arry[1] == "white")
                        value1 = null;
                    if (arry[2] == "white")
                        value = null;
                    that.applyCashBar(value, value1, dataSet[2], leftScale, rightScale, bar, g, flag);
                })
                .on("touchstart", function () {
                    event.preventDefault();
                    d3.event.stopPropagation();
                    var flag = 1;
                    var value = dataSet[0];
                    var value1 = dataSet[1];
                    var tarRect = d3.select(this).select(".check");
                    if (tarRect.attr("fill") == "white")
                        tarRect.attr("fill", "gray");
                    else
                        tarRect.attr("fill", "white");
                    var arry = "";
                    gCheck.selectAll(".check").each(function () {
                        arry = arry + d3.select(this).attr("fill") + ",";
                    });
                    arry = arry.substring(0, arry.length - 1);
                    arry = arry.split(",");
                    if (arry[0] == "white")
                        flag = 0;
                    if (arry[1] == "white")
                        value1 = null;
                    if (arry[2] == "white")
                        value = null;
                    that.applyCashBar(value, value1, dataSet[2], leftScale, rightScale, bar, g, flag);
                });
            });

            return bar;
        }
        /* Draw cash bar chart
           @set - bottom bars data set
           @set1 - top bars data set
           @set2 - points data set
           @flag - if to draw the points and lines
        */
        , applyCashBar: function (set, set1, set2, leftScale, rightScale, bar, g, flag) {
            var that = this;
            bar.selectAll("g").remove();
            var gBars = bar.selectAll("g").data(set2).enter().append("g");
            var pointsDelay = 0;
            var xSacale = this.xScale(set2.length);
            var cellWidth = xSacale(2) - xSacale(1);
            var barWidth = 14;
            var padding = parseInt((cellWidth - barWidth) / 2);

            // if both bars are needed
            if (set != null && set1 != null) {
                pointsDelay = 1600;
                var rect = gBars.data(set).append("rect")
                    .attr("x", function (d, i) { return xSacale(i + 1) + padding; })
                    .attr("y", settings.height - settings.footHeight)
                    .attr("width", barWidth).attr("fill", "#0072c5")
                    .attr("height", 0)
                    .transition().duration(800).ease("linear")
                    .attr("y", function (d, i) {
                        return leftScale(d);
                    })
                    .attr("height", function (d, i) {
                        return settings.height - settings.footHeight - leftScale(d);
                    }).attr("text", function (d) { return d; });

                var rect1 = gBars.data(set1).append("rect")
                    .attr("x", function (d, i) { return xSacale(i + 1) + padding; })
                    .attr("y", function (d, i) { return leftScale(set[i]); })
                    .attr("width", barWidth).attr("fill", "#00b193").attr("height", 0)
                    .transition().duration(800).delay(800).ease("linear")
                    .attr("y", function (d, i) {
                        var height = settings.height - settings.footHeight - leftScale(d);
                        return leftScale(set[i]) - height;
                    })
                    .attr("height", function (d, i) {
                        return settings.height - settings.footHeight - leftScale(d);
                    }).attr("text", function (d) { return d; });
            }
                // only bottom bars
            else if (set != null) {
                pointsDelay = 800;
                var rect = gBars.data(set).append("rect")
                    .attr("x", function (d, i) { return xSacale(i + 1) + padding; })
                    .attr("y", settings.height - settings.footHeight)
                    .attr("width", barWidth).attr("fill", "#0072c5")
                    .attr("height", 0)
                    .transition().duration(800).ease("linear")
                    .attr("y", function (d, i) {
                        return leftScale(d);
                    })
                    .attr("height", function (d, i) {
                        return settings.height - settings.footHeight - leftScale(d);
                    }).attr("text", function (d) { return d; });
            }
                // only top bars
            else if (set1 != null) {
                pointsDelay = 800;
                var rect1 = gBars.data(set1).append("rect")
                    .attr("x", function (d, i) { return xSacale(i + 1) + padding; })
                    .attr("y", settings.height - settings.footHeight)
                    .attr("width", barWidth).attr("fill", "#00b193").attr("height", 0)
                    .transition().duration(800).ease("linear")
                    .attr("y", function (d, i) {
                        return leftScale(d);
                    })
                    .attr("height", function (d, i) {
                        return settings.height - settings.footHeight - leftScale(d);
                    }).attr("text", function (d) { return d; });
            }
            g.select(".gshow").remove();
            var gshow = g.append("g").attr("class", "gshow");
            var showRect = this.drawRect(gshow, 0, 0, 13, 8, "black")
                                    .attr("display", "none")
                                    .attr("rx", 4)
                                    .attr("ry", 4)
                                    .attr("class", "showRect");
            var showText = this.drawText(gshow, 5, 14, "", 4.8, "white")
                                    .attr("font-weight", "bold")
                                    .attr("display", "none")
                                    .attr("class", "showText");

            if (flag) {
                var points = []         // destination position
                    , startData = [];   // original position
                for (var i = 0; i < set2.length; i++) {
                    points.push({ x: xSacale(i + 1) + padding + 7, y: rightScale(set2[i]) });
                    startData.push({ x: xSacale(i + 1) + padding + 7, y: settings.height - settings.footHeight });
                }

                var gPath = bar.append("g");

                // create segment lines rather than path
                var lines = [];
                for (var i = 1; i < startData.length; i++) {
                    var line = gPath.append("line")
                        .attr("x1", startData[i - 1].x)
                        .attr("y1", startData[i - 1].y)
                        .attr("x2", startData[i].x)
                        .attr("y2", startData[i].y)
                        .attr("stroke", "#FFD800")
                        .attr("stroke-width", 2)
                        .attr("fill", "none");
                    lines.push(line);
                }

                var circle = gPath.selectAll("circle").data(startData).enter().append("circle")
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
                    .attr("r", 2.5)
                    .attr("fill", "#FFD800")
                    .attr("stroke", "#FFD800")
                    .attr("stroke-width", 1);
                circle.data(set2).attr("text", function (d) { return d; });

                // delay the points and lines animation to make sure the bars animation is complete.
                setTimeout(function () {
                    // the animation initial parameters here:
                    var animate = 3000      // the animation duration milliseconds.
                        , delay = 220       // the delay milliseconds between previous point/line and next point/line.
                        , elapsed = 0       // current time. In common, it begins with 0 and will be added by each interval value.
                        , interval = 10;    // the interval milliseconds.
                    clearInterval(timer);
                    var timer = setInterval(function () {
                        var n = 0;
                        for (var i = 0, ci; ci = circle[0][i]; i++) {
                            var cy_source = startData[i].y              // the original y position
                                , cy_current = d3.select(ci).attr("cy") // the current y position
                                , cy_target = points[i].y;              // the destination y position
                            // the first point cy and line y1 always move
                            if (i == 0) {
                                if (elapsed > animate) {
                                    n++;
                                    continue;
                                }
                                // call animation easing function to get the current moving value
                                var cy_move = IR.Tween.Back.easeOut(elapsed, cy_source, cy_target - cy_source, animate);
                                d3.select(ci).attr("cy", cy_move);
                                if (i < circle[0].length - 1) lines[i].attr("y1", cy_move);
                            }
                                // the rest points and lines are delay to move one by one based on the defined delay value
                            else {
                                if ((elapsed - elapsed % (delay * i)) > 1) {
                                    if ((elapsed - i * delay) > animate) {
                                        n++;
                                        continue;
                                    }
                                    // call animation easing function to get the current moving value
                                    var cy_move = IR.Tween.Back.easeOut(elapsed - i * delay, cy_source, cy_target - cy_source, animate);
                                    d3.select(ci).attr("cy", cy_move);
                                    if (i < circle[0].length - 1) {
                                        lines[i - 1].attr("y2", cy_move);
                                        lines[i].attr("y1", cy_move);
                                    }
                                    // update the last line y2 value
                                    if (i == circle[0].length - 1) lines[i - 1].attr("y2", cy_move);
                                }
                            }
                        }

                        // if all points and lines are arrived to destination, stop the animation.
                        if (n == circle[0].length - 1) {
                            clearInterval(timer);
                            // correct the points and lines distination position
                            for (var i = 0, ci; ci = circle[0][i]; i++) {
                                d3.select(ci).attr("cy", points[i].y);
                                if (i < circle[0].length - 1) {
                                    lines[i].attr("y1", points[i].y);
                                    lines[i].attr("y2", points[i + 1].y);
                                }
                            }
                        }
                        elapsed += interval;
                    }, interval);
                }, pointsDelay);

                setTimeout(function () {
                    d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                }, pointsDelay + 4000);


                circle.on("mouseover", function () {
                    var x = d3.select(this).attr("cx") - 10;
                    var y = d3.select(this).attr("cy");
                    var text = d3.select(this).attr("text");
                    var txtarr = text.split('.');
                    if (txtarr.length == 2 && txtarr[1].length < 2) {
                        var dis = 2 - txtarr[1].length;
                        for (var i = 0; i < dis; i++) {
                            text = text + "0";
                        }
                    }
                    showText.attr("display", "block").attr("x", parseInt(x) + 5).attr("y", parseInt(y) - 6).text("$" + text);
                    var _rect = showText.node().getBBox();
                    showRect.attr("display", "block").attr("x", _rect.x - 3).attr("y", _rect.y - 0.5).attr("width", _rect.width + 6).attr("height", _rect.height + 2);
                    if (!webtrends1) {
                        IR.Common.addWebTrends(settings.title, "Mouse Hover Point");
                    }
                    webtrends1 = true;

                }).on("mouseout", function () {
                    showRect.attr("display", "none");
                    showText.attr("display", "none");
                    webtrends1 = false;
                })
                .on("touchstart", function () {
                    event.preventDefault();
                    d3.event.stopPropagation();

                    that.barMouseoutForTouch(gBars, showRect, showText);

                    var x = d3.select(this).attr("cx") - 10;
                    var y = d3.select(this).attr("cy");
                    var text = d3.select(this).attr("text");
                    var txtarr = text.split('.');
                    if (txtarr.length == 2 && txtarr[1].length < 2) {
                        var dis = 2 - txtarr[1].length;
                        for (var i = 0; i < dis; i++) {
                            text = text + "0";
                        }
                    }
                    showText.attr("display", "block").attr("x", parseInt(x) + 5).attr("y", parseInt(y) - 6).text("$" + text);
                    var _rect = showText.node().getBBox();
                    showRect.attr("display", "block").attr("x", _rect.x - 3).attr("y", _rect.y - 0.5).attr("width", _rect.width + 6).attr("height", _rect.height + 2);
                });
            }

            gBars.selectAll("rect").each(function () {
                d3.select(this).on("mouseover", function () {

                    d3.select(this).attr("cursor", "pointer");
                    if (d3.select(this).attr("fill") == "#00b193") {
                        d3.select(this).attr("fill", "#008e76");
                    }
                    else {
                        d3.select(this).attr("fill", "#005b9e");
                    }

                }).on("mouseout", function () {
                    if (d3.select(this).attr("fill") == "#008e76")
                        d3.select(this).attr("fill", "#00b193");
                    else
                        d3.select(this).attr("fill", "#0072c5");
                    showRect.attr("display", "none");
                    showText.attr("display", "none");
                    webtrends1 = false;
                }).on("mousemove", function () {
                    var rectX = parseInt(d3.select(this).attr("x")) + 12;
                    var x = d3.mouse(this)[0] + 8;
                    var y = d3.mouse(this)[1];
                    showText.attr("display", "block").attr("x", x).attr("y", parseInt(y) + 8).text("$" + parseFloat($(this).attr("text")).toFixed(3));
                    var _rect = showText.node().getBBox();
                    showRect.attr("display", "block").attr("x", _rect.x - 3).attr("y", _rect.y - 0.5).attr("width", _rect.width + 6).attr("height", _rect.height + 2);
                    if (!webtrends1) { IR.Common.addWebTrends(settings.title, "Mouse Hover Bar"); }
                    webtrends1 = true;
                })
                .on("touchstart", function () {
                    event.preventDefault();
                    d3.event.stopPropagation();

                    that.barMouseoutForTouch(gBars, showRect, showText);

                    if (d3.select(this).attr("fill") == "#00b193")
                        d3.select(this).attr("fill", "#008e76");
                    else
                        d3.select(this).attr("fill", "#005b9e");

                    var rectX = parseInt(d3.select(this).attr("x")) + 12;
                    var x = d3.mouse(this)[0] + 8;
                    var y = d3.mouse(this)[1];
                    showText.attr("display", "block").attr("x", x).attr("y", parseInt(y) + 8).text("$" + parseFloat($(this).attr("text")).toFixed(3));
                    var _rect = showText.node().getBBox();
                    showRect.attr("display", "block").attr("x", _rect.x - 3).attr("y", _rect.y - 0.5).attr("width", _rect.width + 6).attr("height", _rect.height + 2);
                });
            });
        }
        , barMouseover: function (gBars, showRect, showText) {
            var size = gBars.selectAll("rect").size();
            if (size != 0) {
                var tarRect = gBars.select("rect");
                var tarText = gBars.select("text");
                var box = tarRect.node().getBBox();
                var box_y = box.y;
                if (tarRect.attr("fill") == "#00b193") {
                    tarRect.attr("fill", "#008e76");


                }
                else if (tarRect.attr("fill") == "#0072c5") {
                    tarRect.attr("fill", "#005b9e");


                }

                var txt = tarText.text();
                if (txt.length != 0) {
                    tarText.attr("display", "none");
                    if (txt.indexOf("-") > 0) {
                        box_y = parseFloat(box.y) + parseFloat(tarRect.attr("height")) + 11;
                    }
                    //设置并显示showRect，showText
                    showText.attr("display", "block").attr("x", box.x).attr("y", box_y - 3).text(txt);
                    var _rect = showText.node().getBBox();
                    var x_fix = box.x + box.width / 2 - _rect.width / 2;
                    showText.attr("x", x_fix);
                    showRect.attr("display", "block").attr("x", x_fix - 3).attr("y", _rect.y - 0.8).attr("width", _rect.width + 6).attr("height", _rect.height + 1.5);

                }
            }
            if (!webtrends1) {
                IR.Common.addWebTrends(settings.title, "Mouse Hover Bar");
            }
            webtrends1 = true;
        }
        , barMouseout: function (gBars, showRect, showText) {
            var size = gBars.selectAll("rect").size();
            if (size != 0) {
                var tarRect = gBars.select("rect");
                if (tarRect.attr("fill") == "#008e76") {
                    tarRect.attr("fill", "#00b193");
                }
                else if (tarRect.attr("fill") == "#005b9e") {
                    tarRect.attr("fill", "#0072c5");
                }
                gBars.select("text").attr("display", "block");
                showRect.attr("display", "none");
                showText.attr("display", "none");
            }
            webtrends1 = false;
        }
        , barMouseoutForTouch: function (gBars, showRect, showText) {
            if (showRect.size() == 1) {
                showRect.attr("display", "none");
            }
            if (showText.size() == 1) {
                showText.attr("display", "none");
            }

            if (gBars != null && (gBars.size() != 0)) {
                gBars.each(function () {
                    var size = d3.select(this).selectAll("rect").size();
                    if (size != 0) {
                        d3.select(this).selectAll("rect").each(function () {
                            if (d3.select(this).attr("fill") == "#008e76") {
                                d3.select(this).attr("fill", "#00b193");
                            }
                            else if (d3.select(this).attr("fill") == "#005b9e") {
                                d3.select(this).attr("fill", "#0072c5");
                            }
                        });

                        var text = d3.select(this).select("text");
                        if (text.size() != 0) {
                            text.attr("display", "block");
                        }
                    }
                })
            }
        }
        , applyCheckbox: function (gTar) {
            var gCheck = gTar.append("g");
            var check1 = gCheck.append("g");
            this.drawRect(check1, 11, 125, 6, 6, "white").attr("stroke", "gray").attr("stroke-width", 0.5);
            this.drawRect(check1, 12, 126, 4, 4, "gray").attr("class", "check");
            this.drawCircle(check1, 23, 128, 2.5, "#FFD800", "#FFD800", 1);
            this.drawLine(check1, 25.5, 128, 40, 128, "#FFD800", 2);
            this.drawText(check1, 45, 131, "Dividends Per Share", 5, "black");
            this.drawText(check1, 92, 131, "*", 4.5, "rgb(244,104,14)");

            var check2 = gCheck.append("g");
            this.drawRect(check2, 11, 135, 6, 6, "white").attr("stroke", "gray").attr("stroke-width", 0.5);
            this.drawRect(check2, 12, 136, 4, 4, "gray").attr("class", "check");
            this.drawRect(check2, 21, 136, 19, 6, "#00B193");
            this.drawText(check2, 45, 141, "Total Dividends (Accrual Basis)", 5, "black");

            var check3 = gCheck.append("g");
            this.drawRect(check3, 11, 145, 6, 6, "white").attr("stroke", "gray").attr("stroke-width", 0.5);
            this.drawRect(check3, 12, 146, 4, 4, "gray").attr("class", "check");
            this.drawRect(check3, 21, 146, 19, 6, "#0072C5");
            this.drawText(check3, 45, 151, "Share Buyback (Accrual Basis)", 5, "black");

            this.drawText(gCheck, 13, 163, "*", 6, "rgb(244,104,14)");
            this.drawText(gCheck, 18, 162, "refer to right-hand scale", 4.2, "gray");
            return gCheck;
        }
        , switchDonut: function (moveto, gNavBar, gTxt, dataArry, gPieArray, labels, gDesc, shadow, gshow, midTxt1, midTxt2, gMid1, gMid2) {
            var that = this;
            //饼圈各部分数据数组
            var valueData = dataArry[0];
            //总数（饼圈数据+最下方页脚的数据）
            var sumValue1 = d3.sum(dataArry[0][0].concat(dataArry[1][0]));
            var sumValue2 = d3.sum(dataArry[0][1].concat(dataArry[1][1]));
            //rect white   text gray
            var qTxt = gNavBar.select("text");
            var yTxt = gNavBar.selectAll("text:nth-of-type(2)");
            var bgrect = gNavBar.select(".bgrect");
            //rect white   text gray
            if (moveto == "left") {
                if (qTxt.attr("fill") != "#7e7e7e") {
                    bgrect.transition().duration(300)
                        .attr("transform", "translate(0,0)")
                        .each("end", function () {
                            qTxt.attr("fill", "#7e7e7e");
                            yTxt.attr("fill", "#fff");
                        });
                }
            }
            else {
                bgrect.transition().duration(300)
                    .attr("transform", "translate(50,0)")
                    .each("end", function () {
                        qTxt.attr("fill", "#fff");
                        yTxt.attr("fill", "#7e7e7e");
                    });
            }

            //改gTxt的文字
            gTxt.selectAll("text").data(labels).text(function (d, i) { return d; });

            //改饼状图
            gPieArray[0].selectAll("g").remove();
            gPieArray[1].selectAll("g").remove();
            gPieArray[0].attr("sumvalue", sumValue1);
            gPieArray[1].attr("sumvalue", sumValue2);
            var pie = d3.layout.pie().sort(null);//画饼状图的函数(无排序)

            var outerRadius = settings.width / 5.2;//外半径
            var innerRadius = settings.width / 7.9;//内半径   内外半径的差就是饼的厚度
            var arc = d3.svg.arc()
                .padAngle(.045)
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            var arcs1 = gPieArray[0].selectAll("g")
                .data(pie(valueData[0]))
                .enter()
                .append("g")
                .attr("class", "arcs")
                .style("cursor", "pointer")
                .attr("transform", "translate(43,72)");//103,175

            var arcs2 = gPieArray[1].selectAll("g")
                .data(pie(valueData[1]))
                .enter()
                .append("g")
                .attr("class", "arcs")
                .style("cursor", "pointer")
                .attr("transform", "translate(117,72)");//298,175

            arcs1.append("path")
                .attr("fill", function (d, i) {
                    return settings.color[i];
                })
            //.attr("stroke", "#fff")
            //.attr("stroke-width", 13)
                .attr("opacity", ".05")
                .attr("d", function (d) {
                    arc.outerRadius(outerRadius + 5); //变化开始状态的外半径
                    arc.innerRadius(innerRadius + 3); //变化开始状态的内半径
                    return arc(d);
                })
                .transition() //启动变化，上下代码为从什么变化成什么
                .duration(1000) //整个动态效果的持续时间
                .ease("circle-out") //动态效果的方式
                .attr("opacity", "1")
                .attr("d", function (d) {
                    arc.outerRadius(outerRadius); //变化结束状态的外半径
                    arc.innerRadius(innerRadius); //变化结束状态的内半径
                    return arc(d);
                })
                .each("end", function () {
                    d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                });
            //.attr("stroke-width", 5);

            arcs1.append("text")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.value.toFixed(settings.precision);
                })
                .attr("font-size", 5)
                .attr("font-weight", "bold")
                .attr("fill", "white")
                .attr("display", "none")
                .attr("exactvalue", function (d) { return d.value; });


            arcs2.append("path")
                .attr("fill", function (d, i) {
                    return settings.color[i];
                })
            //.attr("stroke", "#fff")
            //.attr("stroke-width", 13)
                .attr("opacity", ".05")
                .attr("d", function (d) {
                    arc.outerRadius(outerRadius + 5); //变化开始状态的外半径
                    arc.innerRadius(innerRadius + 3); //变化开始状态的内半径
                    return arc(d);
                })
                .transition() //启动变化，上下代码为从什么变化成什么
                .duration(1000) //整个动态效果的持续时间
                .ease("circle-out") //动态效果的方式
                .attr("opacity", "1")
                .attr("d", function (d) {
                    arc.outerRadius(outerRadius); //变化结束状态的外半径
                    arc.innerRadius(innerRadius); //变化结束状态的内半径
                    return arc(d);
                })
                .each("end", function () {
                    d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                });
            //.attr("stroke-width", 5);

            arcs2.append("text")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.value.toFixed(settings.precision);
                })
                .attr("font-size", 5)
                .attr("font-weight", "bold")
                .attr("fill", "white")
                .attr("display", "none")
                .attr("exactvalue", function (d) { return d.value; });


            arcs1.on("mouseover", function (e) {
                that.mouseoverArc(d3.select(this), gDesc, shadow, midTxt1, gMid1, 43);
            })
            .on("mouseout", function () {
                var sumValue = 0;
                if (moveto == "left") {
                    sumValue = d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0])).toFixed(settings.precision);
                }
                else {
                    sumValue = d3.sum(values.YearToDate[0].concat(unallocatedValue.YearToDate[0])).toFixed(settings.precision);
                }

                midTxt1.text("$" + sumValue);

                that.mouseoutArc(d3.select(this), gDesc, shadow, gshow, gMid1, 43);//103
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();

                that.mouseoutDescForTouch(gDesc.selectAll("g"), shadow, gPieArray[0], gPieArray[1], gMid1, gMid2, midTxt1, midTxt2, (moveto == "left") ? true : false);

                that.mouseoverArc(d3.select(this), gDesc, shadow, midTxt1, gMid1, 43);

                var sumValue = d3.select(this.parentNode).attr("sumvalue");
                var value = d3.select(this).select("text").attr("exactvalue");
                var x = d3.mouse(d3.select(this.parentNode).node())[0];
                var y = d3.mouse(d3.select(this.parentNode).node())[1];
                var baseCoordinates = d3.select(this).node().getBBox();
                gshow.select("text").attr("x", x - 2).attr("y", y - 5).attr("display", "block")
                    .text(Math.round(parseFloat(value) / parseFloat(sumValue) * 100).toFixed(0) + "%");
                var _rect = gshow.select("text").node().getBBox();
                gshow.select("rect").attr("display", "block").attr("x", _rect.x - 4).attr("y", _rect.y - 1).attr("width", _rect.width + 8).attr("height", _rect.height + 2);
            });
            arcs2.on("mouseover", function () {
                that.mouseoverArc(d3.select(this), gDesc, shadow, midTxt2, gMid2, 117);//298
            })
            .on("mouseout", function () {
                var sumValue = 0;
                if (moveto == "left") {
                    sumValue = d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1])).toFixed(settings.precision);
                }
                else {
                    sumValue = d3.sum(values.YearToDate[1].concat(unallocatedValue.YearToDate[1])).toFixed(settings.precision);
                }

                midTxt2.text("$" + sumValue);

                that.mouseoutArc(d3.select(this), gDesc, shadow, gshow, gMid2, 117);//298
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();

                that.mouseoutDescForTouch(gDesc.selectAll("g"), shadow, gPieArray[0], gPieArray[1], gMid1, gMid2, midTxt1, midTxt2, (moveto == "left") ? true : false);

                that.mouseoverArc(d3.select(this), gDesc, shadow, midTxt2, gMid2, 117);//298

                var sumValue = d3.select(this.parentNode).attr("sumvalue");
                var value = d3.select(this).select("text").attr("exactvalue");
                var x = d3.mouse(d3.select(this.parentNode).node())[0];
                var y = d3.mouse(d3.select(this.parentNode).node())[1];
                var baseCoordinates = d3.select(this).node().getBBox();
                gshow.select("text").attr("x", x - 2).attr("y", y - 5).attr("display", "block")
                    .text(Math.round(parseFloat(value) / parseFloat(sumValue) * 100).toFixed(0) + "%");
                var _rect = gshow.select("text").node().getBBox();
                gshow.select("rect").attr("display", "block").attr("x", _rect.x - 4).attr("y", _rect.y - 1).attr("width", _rect.width + 8).attr("height", _rect.height + 2);
            });

            d3.selectAll(".arcs").on("mousemove", function () {
                // to display tooltip
                var sumValue = d3.select(this.parentNode).attr("sumvalue");
                var value = d3.select(this).select("text").attr("exactvalue");
                var x = d3.mouse(d3.select(this.parentNode).node())[0];
                var y = d3.mouse(d3.select(this.parentNode).node())[1];
                var baseCoordinates = d3.select(this).node().getBBox();
                gshow.select("text").attr("x", x - 2).attr("y", y - 5).attr("display", "block")
                    .text(Math.round(parseFloat(value) / parseFloat(sumValue) * 100).toFixed(0) + "%");
                var _rect = gshow.select("text").node().getBBox();
                gshow.select("rect").attr("display", "block").attr("x", _rect.x - 4).attr("y", _rect.y - 1).attr("width", _rect.width + 8).attr("height", _rect.height + 2);
            });
        }
        , switchSummary: function (gTar, labels, totalValue) {
            var that = this;
            var value1 = (totalValue[0] >= 0) ? ("$" + (totalValue[0] * 1000) + "M") : ("$(" + Math.abs(totalValue[0] * 1000) + ")M");
            var value2 = (totalValue[1] >= 0) ? ("$" + (totalValue[1] * 1000) + "M") : ("$(" + Math.abs(totalValue[1] * 1000) + ")M");

            var parts = value1.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            value1 = parts.join(".");

            parts = value2.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            value2 = parts.join(".");

            var title1 = (labels[0].indexOf("Q") >= 0) ? ("FY" + labels[0].substring(2) + "-" + labels[0].substring(0, 2)) : (labels[0]);
            var title2 = (labels[1].indexOf("Q") >= 0) ? ("FY" + labels[1].substring(2) + "-" + labels[1].substring(0, 2)) : (labels[1]);

            gTar.select(".gSummary").remove();
            var gSummary = gTar.append("g").attr("class", "gSummary");
            //that.drawText(gSummary, 18, 405, "*", 13, "rgb(244,104,14)");
            //that.drawText(gSummary, 25, 405, "includes " + value1 + " of Corporate and Other in " + title1 + " and " + value2 + " in ", 10, "gray");
            //that.drawText(gSummary, 25, 416, title2 + " not shown on graph", 10, "gray");
            var _txt = [{
                text: "*",
                color: "rgb(244,104,14)",
                size: 4.2,
                x: 12,
                y: 159
            },
                {
                    text: "includes " + value1 + " of Corporate and Other in " + title1 + " and " + value2 + " in " + title2 + " not shown on graph.",
                    color: "gray",
                    size: 3.8,
                    x: 15,
                    y: 159
                }];
            gSummary.selectAll("text").data(_txt).enter().append("text")
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; })
                .attr("dy", ".71em")
                .attr("font-size", function (d) { return d.size; })
                .attr("fill", function (d) { return d.color; })
                .text(function (d) { return d.text; })
                .call(IR.util.wrap, 140);//调用文本折行的方法 140是最大宽度  超过140即折行
        }
        , mouseoverDesc: function (tar, color, midTxt1, text, gMid, gShow, xPie, sumValue) { //sumValue是当前饼状图总值
            if (tar.select("path").attr("fill") === color) {
                tar.select("path").attr("transform", "scale(1.05)");
                tar.select("path").attr("filter", "url(#" + settings.renderTo + "-drop-shadow)");
                var value = tar.select("text").attr("exactvalue");//当前选中部分的值
                midTxt1.text("$" + tar.select("text").text());
                var set = [];
                var strText = text.text().split(" ");
                var length = strText.length;
                for (var i = 0; i < length; i++) {
                    if (i == 0) {
                        set.push(strText[i]);
                    }
                    else {
                        var temp = set.pop();
                        if (temp.length + strText[i].length < 13) {
                            set.push(temp + " " + strText[i]);
                        } else {
                            set.push(temp);
                            set.push(strText[i]);
                        }
                    }
                }

                gMid.selectAll("text").remove();
                var midDes = gMid.append("text").attr("x", xPie).attr("y", 72).style("text-anchor", "middle");
                midDes.selectAll("tspan").data(set).enter().append("tspan")
                    .attr("x", midDes.attr("x"))
                    .attr("dy", "1em")
                    .text(function (d) {
                        return d;
                    });
                //这里显示比例
                var arr = d3.transform(tar.select("text").attr("transform")).translate;
                var x = xPie + parseInt(arr[0]);
                var y = 66 + parseFloat(arr[1]);
                gShow.select("text").attr("x", parseFloat(x) + 5).attr("y", parseFloat(y) + 8).attr("display", "block")
                    .text(Math.round(parseFloat(value) / parseFloat(sumValue) * 100).toFixed(0) + "%");
                var _rect = gShow.select("text").node().getBBox();
                gShow.select("rect").attr("display", "block").attr("x", _rect.x - 4).attr("y", _rect.y - 1).attr("width", _rect.width + 8).attr("height", _rect.height + 2);
            }
        }
        , mouseoutDescForTouch: function (gTar, shadow, gPie, gPie1, gMid, gMid2, midTxt1, midTxt2) {
            gTar.each(function () {
                //desc 的text归位 (先判断下是否是mouseover状态)
                var text = d3.select(this).select("text");
                var xTxt = text.attr("x");
                var yTxt = text.attr("y");
                if (parseInt(xTxt) != 22) {
                    text.attr("x", parseInt(xTxt) + 1).attr("y", parseInt(yTxt) + 1);
                }
            });

            shadow.attr("display", "none");
            gPie.selectAll("path").attr("transform", "scale(1)").attr("filter", "none");
            gPie1.selectAll("path").attr("transform", "scale(1)").attr("filter", "none");

            var set = ["Total Company", "Revenue", "*"];
            gMid.selectAll("text").remove();
            gMid2.selectAll("text").remove();
            gMid.selectAll("text").data(set).enter().append("text")
                .attr("x", function (d, i) {
                    if (i == 2) return 57;
                    else return 43;
                })
                .attr("y", function (d, i) {
                    if (i == 2) return 75 + (6 * (i - 1))
                    else return 75 + (6 * i);
                }).style("text-anchor", "middle").text(function (d, i) { return d; })
                .attr("fill", function (d, i) {
                    if (i == 2) return "red";
                });

            gMid2.selectAll("text").data(set).enter().append("text")
                .attr("x", function (d, i) {
                    if (i == 2) return 129;
                    else return 117;
                })
                .attr("y", function (d, i) {
                    if (i == 2) return 75 + (6 * (i - 1))
                    else return 75 + (6 * i);
                }).style("text-anchor", "middle").text(function (d, i) { return d; })
                .attr("fill", function (d, i) {
                    if (i == 2) {
                        return "red";
                    }
                });

            d3.select("#" + settings.renderTo).select("g").selectAll(".gShow").each(function () {
                d3.select(this).select("rect").attr("display", "none");
                d3.select(this).select("text").attr("display", "none");
            });

            if (!bQuarterly) {
                midTxt1.text("$" + d3.sum(values.YearToDate[0].concat(unallocatedValue.YearToDate[0])).toFixed(settings.precision));
                midTxt2.text("$" + d3.sum(values.YearToDate[1].concat(unallocatedValue.YearToDate[1])).toFixed(settings.precision));
            }
            else {
                midTxt1.text("$" + d3.sum(values.Quarterly[0].concat(unallocatedValue.Quarterly[0])).toFixed(settings.precision));
                midTxt2.text("$" + d3.sum(values.Quarterly[1].concat(unallocatedValue.Quarterly[1])).toFixed(settings.precision));
            }
        }
        , mouseoverArc: function (arc, gDesc, shadow, midTxt, gMid, xPie) {
            var tarcolor = arc.select("path").attr("fill");

            arc.select("path").attr("transform", "scale(1.05)");
            arc.select("path").attr("filter", "url(#" + settings.renderTo + "-drop-shadow)");
            midTxt.text("$" + arc.select("text").text());
            gDesc.selectAll("g").each(function () {
                var rect = d3.select(this).select("rect");
                var text = d3.select(this).select("text");
                if (rect.attr("fill") === tarcolor) {
                    var y = rect.attr("y");
                    var xTxt = text.attr("x");
                    var yTxt = text.attr("y");
                    shadow.attr("display", "block").attr("y", parseInt(y) + 1);
                    text.attr("x", parseInt(xTxt) - 1).attr("y", parseInt(yTxt) - 1);

                    var set = [];
                    var strText = text.text().split(" ");
                    var length = strText.length;
                    for (var i = 0; i < length; i++) {
                        if (i == 0) {
                            set.push(strText[i]);
                        }
                        else {
                            var temp = set.pop();
                            if (temp.length + strText[i].length < 13) {
                                set.push(temp + " " + strText[i]);
                            } else {
                                set.push(temp);
                                set.push(strText[i]);
                            }
                        }
                    }

                    gMid.selectAll("text").remove();
                    var midDes = gMid.append("text").attr("x", xPie).attr("y", 72).style("text-anchor", "middle");
                    midDes.selectAll("tspan").data(set).enter().append("tspan")
                        .attr("x", midDes.attr("x"))
                        .attr("dy", "1em")
                        .text(function (d) {
                            return d;
                        });
                }

            });
            if (webtrends1 != false) {
                IR.Common.addWebTrends(settings.title, "Mouse Hover Doughnut");
                webtrends1 = false;
            }


        }
        , mouseoutArc: function (arc, gDesc, shadow, gshow, gMid, gPie) {
            var tarcolor = arc.select("path").attr("fill");
            arc.select("path").attr("transform", "scale(1)").attr("filter", "none");
            gDesc.selectAll("g").each(function () {
                var rect = d3.select(this).select("rect");
                var text = d3.select(this).select("text");
                if (rect.attr("fill") === tarcolor) {
                    var xTxt = text.attr("x");
                    var yTxt = text.attr("y");
                    text.attr("x", parseInt(xTxt) + 1).attr("y", parseInt(yTxt) + 1);
                    shadow.attr("display", "none");
                }
            });

            var set = ["Total Company", "Revenue", "*"];
            gMid.selectAll("text").remove();

            //gMid.selectAll("text").data(set).enter().append("text")
            //    .attr("x",  gPie)
            //    .attr("y", function (d, i) {return 180 + (15 * i);
            //    }).style("text-anchor", "middle").text(function (d, i) { return d; });


            gMid.selectAll("text").data(set).enter().append("text")
                .attr("x", function (d, i) {
                    if (i == 2) return gPie + 12;
                    else return gPie;
                })
                .attr("y", function (d, i) {
                    if (i == 2) return 75 + (6 * (i - 1))
                    else return 75 + (6 * i);
                }).style("text-anchor", "middle").text(function (d, i) { return d; })
                .attr("fill", function (d, i) {
                    if (i == 2) {
                        return "red";
                    }
                });
            gshow.select("rect").attr("display", "none");
            gshow.select("text").attr("display", "none");
            webtrends1 = true;
        }
        //双柱图页脚的文字
        , applyBarSegmentFoot: function (gfoot) {
            var xScale = this.xScale(settings.groupTitles.length);
            var midWidth = parseInt((xScale(2) - xScale(1)) / 2);
            for (var i = 0; i < settings.groupTitles.length; i++) {
                var text = gfoot.append("text").attr("x", xScale(i + 1) + midWidth).attr("y", 135).attr("text-anchor", "middle");
                var splitData = settings.groupTitles[i].split(' ');
                var txtFoot = [];
                for (var j = 0; j < splitData.length; j++) {
                    if (j == 0) {
                        txtFoot.push(splitData[j]);
                    }
                    else {
                        var temp = txtFoot.pop();
                        if ((splitData[j].length <= 2) && (splitData[j].length + temp.length) <= 10) {
                            txtFoot.push(temp + " " + splitData[j]);
                        }
                        else {
                            txtFoot.push(temp);
                            txtFoot.push(splitData[j]);
                        }
                    }
                }
                text.selectAll("tspan").data(txtFoot).enter().append("tspan")
                    .attr("x", text.attr("x"))
                    .attr("dy", "1.1em")
                    .text(function (d) {
                        return d;
                    });
            }
        }
        //响应式
        , onResize: function () {
            var divWidth = $("#" + settings.renderTo).parent().width();
            //重新计算scale值
            settings.scale = parseFloat(divWidth / settings.width).toFixed(2);
            var marginLeft = settings.width * 2.5 - divWidth;

            var width = $(window).width();
            if (width < 663) {
                d3.select("body").select("#" + settings.renderTo).select(".gFixed").attr("display", "none");
                d3.select("#" + settings.renderTo)
                    .attr("width", settings.width * settings.scale)
                    .attr("height", settings.height)
                    .style("margin-left", "0px");
                pined = false;
            }
            else {
                d3.select("body").select("#" + settings.renderTo).select(".gFixed").attr("display", "block");
                if (!pined) {
                    d3.select("#" + settings.renderTo)
                        .attr("width", settings.width * settings.scale)
                        .attr("height", settings.height)
                        .style("margin-left", "0px");
                }
                else {
                    d3.select("#" + settings.renderTo).style("margin-left", -marginLeft + "px");
                }
            }
            var height = parseInt(settings.height * (divWidth / settings.width)) + 10;
            $("#" + settings.renderTo).parent().height(height);

        }
        , getViewBox: function (flag) {
            var oriViewBox = "0 0 " + settings.width + " " + (settings.height / settings.scale).toFixed(2);
            var zoomViewBox = "";
            if (oriViewBox) {
                var vbArray = oriViewBox.split(" ");
                if (vbArray.length == 4)
                    zoomViewBox = vbArray[0] + " " + vbArray[1] + " " + vbArray[2] + " " + settings.height;
            }
            if (flag == "min") return oriViewBox;
            else return zoomViewBox;
        }
        //画双柱子
        , drawDoubleBar: function (arrayValue, yScale, valueData, gContent, g) {
            var that = this;
            var xScale = this.xScale(valueData.length / 2);
            var cellWidth = xScale(2) - xScale(1);
            var barWidth = 12;//默认bar的宽度为12
            var showRectWidth = 26;
            if (valueData.length / 2 == 3) {
                barWidth = 24;
                showRectWidth = 50;
            }
            var padding = parseInt((cellWidth - barWidth * 2) / 2);

            //画双柱子
            var index = (arrayValue.indexOf(0) > 0) ? 0 : d3.min(arrayValue);//起始参考线的位置（0）

            var bar = gContent.append("g");
            var gBars = bar.selectAll("g").data(labels.Quarterly).enter().append("g");
            //起始y坐标是0刻度的坐标
            var gBarsRects = gBars.append("g").attr("class", "gBarsRects");
            gBarsRects.append("rect")
                .attr("x", function (d, i) { return xScale(i + 1) + padding; })
                .attr("y", yScale(0))
                .attr("width", barWidth)
                .attr("fill", "#00b193")
                .attr("height", 0)
                .style("cursor", "pointer");
            gBarsRects.append("rect")
                .attr("x", function (d, i) { return xScale(i + 1) + barWidth + padding; })
                .attr("y", yScale(0))
                .attr("width", barWidth)
                .attr("fill", "#0072c5")
                .attr("height", 0)
                .style("cursor", "pointer");

            bar.selectAll("rect").data(valueData).transition().duration(1000)
                .attr("y", function (d, i) {
                    var value = parseFloat(d).toFixed(settings.precision);
                    if (d < 0) {
                        return yScale(0);
                    }
                    else {
                        if (value == 0) return yScale(0.05);
                        else return yScale(d);
                    }
                })
                .attr("height", function (d, i) {
                    var value = parseFloat(d).toFixed(settings.precision);
                    if (value == 0) {
                        return Math.abs(yScale(0.05) - yScale(0));
                    }
                    else
                        return Math.abs(yScale(d) - yScale(0));
                })
                .each("end", function () {
                    d3.select("body").select("#" + settings.renderTo).attr("animate", "finished");
                });

            gBars.append("text")
                .attr("x", function (d, i) { return xScale(i + 1) + padding + barWidth / 2; })
                .attr("y", 0)
                .attr("fill", "gray")
                .attr("class", "txtbar");
            gBars.append("text")
                .attr("x", function (d, i) { return xScale(i + 1) + padding + 3 * barWidth / 2; })
                .attr("y", 0)
                .attr("fill", "gray")
                .attr("class", "txtbar");
            bar.selectAll("text").data(valueData)
                .attr("font-size", 4.8)
                .attr("text-anchor", "middle")
                .attr("display", "none")
                .attr("font-weight", "bold")
                .attr("y", function (d, i) {
                    if (d < 0) return yScale(d) + 8;
                    return yScale(d) - 2;
                })
                .transition().duration(500).delay(1000)
                .attr("display", "block").text(function (d, i) {
                    var value = parseFloat(d).toFixed(settings.precision);
                    if (d < 0 && value == 0) {
                        return "0.0";
                    }
                    else
                        return parseFloat(d).toFixed(settings.precision);
                });

            g.select(".gshow").remove();
            var gshow = g.append("g").attr("class", "gshow");
            var showRect = that.drawRect(gshow, 0, 0, showRectWidth, 10, "black")
                .attr("display", "none")
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "showRect");
            var showText = that.drawText(gshow, (showRectWidth / 2), 6, "", 4.8, "white")
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("display", "none")
                .attr("class", "showText");

            gBarsRects.on("mousemove", function () {
                var txt = "";
                d3.select(this).selectAll("rect").each(function () {
                    var tarRect = d3.select(this);
                    if (tarRect.attr("fill") == "#00b193")
                        tarRect.attr("fill", "#008e76");
                    else if (tarRect.attr("fill") == "#0072c5")
                        tarRect.attr("fill", "#005b9e");
                });
                var box = d3.select(this).node().getBBox();
                var len = d3.select(this.parentNode).selectAll("text").length;
                d3.select(this.parentNode).selectAll("text").each(function (d, i) {
                    var _txt = d3.select(this).text();
                    if (_txt.length != 0) {
                        if (i > 0) _txt = " | " + _txt;
                        txt += _txt;
                    }

                    d3.select(this).attr("display", "none");
                });
                if (txt && txt.length != 0) {
                    //设置并显示showRect，showText
                    showText.attr("display", "block").attr("x", box.x).attr("y", box.y - 4).text(txt);
                    var _rect = showText.node().getBBox();
                    var x_fix = box.x + box.width / 2;
                    showText.attr("x", x_fix);
                    showRect.attr("display", "block").attr("x", box.x - 2)
                        .attr("y", _rect.y - 1)
                        .attr("width", box.width + 6)
                        .attr("height", _rect.height + 2);

                }
                if (!webtrends1) {
                    IR.Common.addWebTrends(settings.title, "Mouse Hover Bar");
                }
                webtrends1 = true;
            }).on("mouseout", function () {
                that.mouseOutForDoubleBar(d3.select(this), showRect, showText);
                webtrends1 = false;
            })
            .on("touchstart", function () {
                event.preventDefault();
                d3.event.stopPropagation();
                that.mouseOutForDoubleBar(gBarsRects, showRect, showText);
                var txt = "";
                d3.select(this).selectAll("rect").each(function () {
                    var tarRect = d3.select(this);
                    if (tarRect.attr("fill") == "#00b193")
                        tarRect.attr("fill", "#008e76");
                    else if (tarRect.attr("fill") == "#0072c5")
                        tarRect.attr("fill", "#005b9e");
                });
                var box = d3.select(this).node().getBBox();
                var len = d3.select(this.parentNode).selectAll("text").length;
                d3.select(this.parentNode).selectAll("text").each(function (d, i) {
                    var _txt = d3.select(this).text();
                    if (_txt.length != 0) {
                        if (i > 0) _txt = " | " + _txt;
                        txt += _txt;
                    }

                    d3.select(this).attr("display", "none");
                });
                if (txt && txt.length != 0) {
                    //设置并显示showRect，showText
                    showText.attr("display", "block").attr("x", box.x).attr("y", box.y - 4).text(txt);
                    var _rect = showText.node().getBBox();
                    var x_fix = box.x + box.width / 2;
                    showText.attr("x", x_fix);
                    showRect.attr("display", "block").attr("x", box.x - 2)
                        .attr("y", _rect.y - 1)
                        .attr("width", box.width + 6)
                        .attr("height", _rect.height + 2);

                }
            });
            return bar;
        }
        , mouseOutForDoubleBar: function (gBarsRects, showRect, showText) {
            if (gBarsRects.size() != 0) {
                gBarsRects.each(function () {
                    d3.select(this).selectAll("rect").each(function () {
                        var tarRect = d3.select(this);
                        if (tarRect.attr("fill") == "#008e76") {
                            tarRect.attr("fill", "#00b193");
                        }
                        if (tarRect.attr("fill") == "#005b9e") {
                            tarRect.attr("fill", "#0072c5");
                        }
                    });
                    d3.select(this.parentNode).selectAll("text").attr("display", "block");
                });
            }
            showRect.attr("display", "none");
            showText.attr("display", "none");
        }
        , drawRect: function (g, x, y, width, height, fill) {
            var rect = g.append("rect").attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("fill", fill);
            return rect;
        }
        , drawLine: function (g, x1, y1, x2, y2, stroke, strokeWidth) {
            var line = g.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke", stroke).attr("stroke-width", strokeWidth);
            return line;
        }
        , drawText: function (g, x, y, text, size, fill) {
            var text = g.append("text").attr("x", x).attr("y", y).attr("font-size", size).attr("fill", fill).text(text);
            return text;
        }
        , drawCircle: function (g, cx, cy, r, fill, stroke, strokeWidth) {
            var circle = g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", r).attr("fill", fill).attr("stroke", stroke).attr("stroke-width", strokeWidth);
            return circle;
        }
    }
}

IR.GenerateChart = function (params, json, container) {
    if (params) {
        var result = [];
        for (var i = 0; i < params.length; i++) {
            var div = $("<div style='width:100%;'></div>");
            var svg = $("<svg style='position:absolute;overflow:hidden;'></svg>");
            svg.attr("id", params[i].renderTo);
            div.append(svg);
            //params[i].renderTo = "svg" + i;
            params[i].jsonData = json;
            container.empty().append(div);

            var divWidth = $(div).width();
            var marginLeft = params[i].width - divWidth;
            //$(svg).css("margin-left", (-marginLeft + "px"));

            var chart = IR.ChartView(params[i]); // to render chart
            result.push(chart);


            var viewBox = d3.select("#" + params[i].renderTo).attr("viewBox");
            var vbArray = viewBox.split(" ");
            if (vbArray && vbArray.length == 4) {
                var _height = $(svg).height();
                //$(div).height(_height / (vbArray[3] / _height) + 10);
                $(div).height(_height + 10);
            }
            else {
                var height = parseInt(params[i].height * (divWidth / params[i].width)) + 10;
                $(div).height(height);
            }
        }
        return result;
    }
}


IR.util = {
    mul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    div: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return IR.util.mul((r1 / r2), pow(10, t2 - t1));
        }
    },
    add: function (arg1, arg2) {
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
        try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
        m = Math.pow(10, Math.max(r1, r2));
        return (IR.util.mul(arg1, m) + IR.util.mul(arg2, m)) / m;
    },
    sub: function (arg1, arg2) {
        return IR.util.add(arg1, -arg2);
    },
    wrap: function (text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1,
                x = text.attr("x"),
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}
