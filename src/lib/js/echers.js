import echarts from "echarts";
export const myChart = (res, Data, id, chart) => {
    let myChart = chart || echarts.init(document.getElementById(id));
    let data = res;
    let ydata = Data;
    // let ydata1 = Data1;

    // 指定图表的配置项和数据
    let option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                lineStyle: {
                    opacity: 0
                }
            },
            confine: true,
            backgroundColor: "rgb(238, 243, 245)",
            borderColor: "#fff",
            borderWidth: 2,
            textStyle: {
                color: "#000",
                fontSize: 15
            }
        },
        title: {
            left: "center"
            // text: "大数据量面积图"
        },
        toolbox: {},
        grid: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 0
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            show: false,
            data: data
            // axisTick: { inside: true, show: false },
            // splitLine: { show: false },
            // axisLine: { show: false }
        },
        yAxis: [{
            type: "value",
            data: ydata,
            axisLine: {
                show: false
            },
            axisTick: {
                inside: true,
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                inside: true,
                showMinLabel: false,
                showMaxLabel: false,
                interval: "auto",
                fontSize: 12,
                margin :2,
                color:'#000',
            },
            splitNumber :3,
        }],
        series: [{
            name: "累计",
            type: "line",
            // AxisIndex: 0,
            // smooth: true,
            itemStyle: {
                normal: {
                    color: "rgba(238, 243, 245,0.1)"
                },
                emphasis: {
                    color: "rgba(225,225,225,0.8)"
                },
            },
            areaStyle: {
                normal: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                                offset: 0,
                                color: "rgb(59, 161, 121)" // 0% 处的颜色
                            },
                            {
                                offset: 0.499,
                                color: "rgb(59, 161, 121)" // 0% 处的颜色
                            },
                            {
                                offset: 0.5,
                                color: "#D35250" // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: "#D35250" // 100% 处的颜色
                            }
                        ],
                        globalCoord: true // 缺省为 false
                    }
                }
            },
            data: ydata
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    return myChart;
}