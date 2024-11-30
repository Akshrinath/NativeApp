import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

interface sensorList {
    name: string;
    color: string;
}
interface DailyActivityProps {
    dataFeed: string[][];
    colorLine: string[];
    sensorsList: sensorList[];
}
const DailyActivity: React.FC<DailyActivityProps> = ({ dataFeed, colorLine, sensorsList }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<any[]>([]);

    useEffect(() => {
        if (!dataFeed || dataFeed.length === 0) {
            console.error('dataFeed is empty or undefined');
            return;
        }
        if (!sensorsList || sensorsList.length === 0) {
            console.error('sensorsList is empty or undefined');
            return;
        }

        const sDate = new Date(dayjs(dataFeed[0][2]).format('YYYY-MM-DD 00:00:00')).getTime();
        const eDate = new Date(dayjs(dataFeed[0][2]).format('YYYY-MM-DD 23:59:59')).getTime();

        const seriesData = sensorsList.map(sensor => ({
            name: sensor.name,
            data: dataFeed
                .filter(item => item[0] === sensor.name)
                .map(item => {
                    if (!item[2] || !item[3]) {
                        console.error('Start time or end time is undefined for item:', item);
                        return null;
                    }
                    return {
                        x: sensor.name,
                        y: [
                            new Date(item[2]).getTime(),
                            new Date(item[3]).getTime()
                        ]
                    };
                })
                .filter(item => item !== null)
        }));

        setChartOptions({
            chart: {
                type: 'rangeBar',
                toolbar: {
                    show: true,
                    autoSelected: 'zoom'
                },
                zoom: {
                    enabled: true,
                    autoScaleYaxis: false
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '85%',
                    rangeBarGroupRows: true,
                    // dataLabels: {
                    //     position: 'center',
                    //     hideOverflowingLabels: false,
                    // },
                    minHeight: 5,
                }
            },
            fill: {
                type: 'solid'
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Time'
                },
                min: sDate,
                max: eDate,
                // tickAmount: 24,
                labels: {
                    formatter: function (value: number) {
                        return dayjs(value).format('hh:mm A');
                    }
                }
            },
            yaxis: {
                categories: sensorsList.map(sensor => sensor.name),
                labels: {
                    style: {
                        fontWeight: 'bold',
                        colors: ['#000000']
                    },
                    formatter: function (value: string) {
                        return value;
                    }
                }
            },
            legend: {
                show: false
            },
            colors: colorLine,
            stroke: {
                width: 0.025,
                colors: ['#fff'],
                connectNulls: true
            },
            grid: {
                borderColor: '#F0F0F0',
            },
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
            tooltip: {
                custom: function (opts: any) {
                    // calculate the time difference between the start and end time in hours
                    const fromTime = new Date(opts.y1).getTime();
                    const toTime = new Date(opts.y2).getTime();
                    const timeDiff = (toTime - fromTime) / 1000 / 60 / 60;

                    // get the sensor name
                    const w = opts.ctx.w;
                    const seriesName = w.config.series[opts.seriesIndex].name
                        ? w.config.series[opts.seriesIndex].name
                        : '';
                    const color = w.globals.colors[opts.seriesIndex];

                    return (
                        '<div class="apexcharts-tooltip-rangebar">' +
                        '<div> <span class="series-name" style="color: ' +
                        color +
                        '">' +
                        (seriesName ? seriesName : '') +
                        '</span></div>' +
                        '<div><span class="value start-value">' +
                        dayjs(fromTime).format('hh:mm A') +
                        '</span> <span class="separator">-</span> <span class="value end-value">' +
                        dayjs(toTime).format('hh:mm A') +
                        '</span> <span class="separator">-</span> <span class="value">' +
                        timeDiff.toFixed(2) +
                        ' hours</span></div>' +
                        '</div>'
                    );
                }
            }
        });

        // Set the chart series
        setChartSeries(seriesData);
    }, [dataFeed, colorLine, sensorsList]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            {dataFeed.length === 0 || sensorsList.length === 0 ? (
                <div>
                    <h1>No data to display</h1>
                </div>
            ) : (
                <ReactApexChart options={chartOptions} series={chartSeries} type="rangeBar" height={400} />
            )}
        </div>
    );
}


interface RRChartProps {
    rrDataProps: { StartTime: string; rr: number }[];
}

const RRChart: React.FC<RRChartProps> = ({ rrDataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: number; y: number | null }[] }[]>([]);

    useEffect(() => {
        if (!rrDataProps) {
            console.error('rrDataProps is empty or undefined');
            return;
        }

        const rrDayData = rrDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: new Date(item.StartTime).getHours() < 12 ? item.rr : null
        }));
        const rrNightData = rrDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: new Date(item.StartTime).getHours() >= 12 ? item.rr : null
        }));

        const selectedDate = new Date(rrDataProps[0].StartTime);
        selectedDate.setHours(0, 0, 0, 0);
        const startDate = selectedDate.getTime();
        selectedDate.setHours(23, 59, 59, 999);
        const endDate = selectedDate.getTime();
        // Set up the chart options
        setChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    show: true,
                },
            },
            xaxis: {
                type: 'datetime',
                title: { text: 'Time' },
                min: startDate,
                max: endDate,
                tickAmount: 24,
                labels: {
                    formatter: (value: number) => {
                        return dayjs(value).format('hh:mm A');
                    },
                    style: { fontSize: '12px' },
                },
                axisBorder: { color: '#e0e0e0' },
                axisTicks: { color: '#e0e0e0' }
            },
            yaxis: {
                title: {
                    text: 'Respiratory Rate (bpm)'
                },
                max: 90,
                axisBorder: {
                    color: '#e0e0e0'
                },
                grid: {
                    borderColor: '#e0e0e0'
                }
            },
            grid: {
                xaxis: {
                    lines: {
                        show: true,
                        color: '#e0e0e0',
                        dashArray: 5
                    }
                },
                yaxis: {
                    lines: {
                        show: true,
                        color: '#e0e0e0'
                    }
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                x: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MMM DD, YYYY hh:mm A');
                    }
                }
            },
            stroke: {
                width: 2,
                curve: 'smooth',
                connectNulls: true
            },
            markers: {
                size: 0,
                colors: ['#FFA500', '#0000FF'],
                // strokeWidth: 2
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'right',
            },
            colors: ['#B762C1', '#008000'],
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
        });

        setChartSeries([
            { name: 'Respiratory Rate (Day)', data: rrDayData },
            { name: 'Respiratory Rate (Night)', data: rrNightData }
        ]);
    }, [rrDataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={400} />
        </div>
    );
};



interface HRChartProps {
    hrDataProps: { StartTime: string; hr: number }[];
}
const HRChart: React.FC<HRChartProps> = ({ hrDataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: number; y: number | null }[] }[]>([]);

    useEffect(() => {
        if (!hrDataProps) {
            console.error('hrDataProps is empty or undefined');
            return;
        }

        const hrDayData = hrDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: new Date(item.StartTime).getHours() < 12 ? item.hr : null
        }));
        const hrNightData = hrDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: new Date(item.StartTime).getHours() >= 12 ? item.hr : null
        }));

        const selectedDate = new Date(hrDataProps[0].StartTime);
        selectedDate.setHours(0, 0, 0, 0);
        const startDate = selectedDate.getTime();
        selectedDate.setHours(23, 59, 59, 999);
        const endDate = selectedDate.getTime();

        // Set up the chart options
        setChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    tools: {
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    }
                },
            },
            xaxis: {
                type: 'datetime',
                title: { text: 'Time' },
                min: startDate,
                max: endDate,
                tickAmount: 24,
                labels: {
                    formatter: (value: number) => {
                        return dayjs(value).format('hh:mm A');
                    },
                    style: { fontSize: '12px' },
                },
                axisBorder: { color: '#e0e0e0' },
                axisTicks: { color: '#e0e0e0' }
            },
            yaxis: {
                title: {
                    text: 'Heart Rate (bpm)'
                },
                max: 90,
                axisBorder: {
                    color: '#e0e0e0'
                },
                grid: {
                    borderColor: '#e0e0e0'
                }
            },
            grid: {
                xaxis: {
                    lines: {
                        show: true,
                        color: '#e0e0e0',
                        dashArray: 5
                    }
                },
                yaxis: {
                    lines: {
                        show: true,
                        color: '#e0e0e0'
                    }
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                x: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MMM DD, YYYY hh:mm A');
                    }
                }
            },
            stroke: {
                width: 2,
                curve: 'smooth',
                connectNulls: true
            },
            markers: {
                size: 0,
                colors: ['#FFA500', '#0000FF'],
                // strokeWidth: 2
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'right',
            },
            colors: ['#FFA500', '#1E90FF'], // Changed colors from gray to orange and blue
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
        });

        setChartSeries([
            { name: 'Heart Rate (Day)', data: hrDayData },
            { name: 'Heart Rate (Night)', data: hrNightData }
        ]);
    }, [hrDataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={400} />
        </div>
    );
};


interface BPChartProps {
    bpDataProps: { StartTime: string; Systolic: number; Diastolic: number }[];
}

const BloodPressureChart: React.FC<BPChartProps> = ({ bpDataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: number; y: number }[] }[]>([]);

    useEffect(() => {
        if (!bpDataProps) {
            console.error('bpDataProps is empty or undefined');
            return;
        }

        const systolicData = bpDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: item.Systolic
        }));

        const diastolicData = bpDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: item.Diastolic
        }));

        const startDate = new Date(bpDataProps[0].StartTime);
        const endDate = new Date(bpDataProps[bpDataProps.length - 1].StartTime);

        setChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    tools: {
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    }
                }
            },
            // title: {
            //     // text: 'Blood Pressure Chart',
            //     // align: 'left',
            //     style: {
            //         fontSize: '20px',
            //         fontWeight: 'bold'
            //     }
            // },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Day'
                },
                min: startDate.getTime(),
                max: endDate.getTime(),
                labels: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MM/DD');
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Blood Pressure (mmHg)'
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                x: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MMM DD, YYYY hh:mm A');
                    }
                }
            },
            colors: ['#ff9933', '#3366ff'],
            stroke: {
                curve: 'smooth',
                width: 3,
                connectNulls: true
            },
            markers: {
                size: 4,
                shape: 'circle',
                opacity: 0.5,
            },
            legend: {
                position: 'bottom'
            },
            grid: {
                borderColor: '#F0F0F0',
            },
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
            annotations: {
                xaxis: [
                    {
                        x: startDate.getTime(),
                        x2: endDate.getTime(),
                        borderColor: '#999',
                        fillColor: '#F3F3F3',
                        opacity: 0.2
                    }
                ]
            }
        });

        setChartSeries([
            {
                name: 'Systolic',
                data: systolicData
            },
            {
                name: 'Diastolic',
                data: diastolicData
            }
        ]);
    }, [bpDataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={400} />
        </div>
    );
};

interface SleepData {
    [date: string]: {
        lightsleepduration: number;
        sleepdur: number;
        deepsleepduration: number;
        remsleepduration: number;
    };
}

interface SleepChartProps {
    sleepDataProps: SleepData;
}

const SleepDurationChart: React.FC<SleepChartProps> = ({ sleepDataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: number; y: number }[] }[]>([
        { name: 'REM Sleep', data: [] },
        { name: 'Light Sleep', data: [] },
        { name: 'Deep Sleep', data: [] },
        { name: 'Awake', data: [] }
    ]);

    useEffect(() => {
        const dates = Object.keys(sleepDataProps);

        const generateSeriesData = (key: string) =>
            dates.map(date => ({
                x: new Date(date).getTime(),
                y: sleepDataProps[date][key as keyof SleepData[string]] || null  // Default to null if the value is missing
            }));

        const lightsleepData = generateSeriesData('lightsleepduration');
        const sleepdurData = generateSeriesData('sleepdur');
        const deepsleepData = generateSeriesData('deepsleepduration');
        const remsleepData = generateSeriesData('remsleepduration');

        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[dates.length - 1]);

        setChartOptions({
            chart: {
                type: 'bar',
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 3,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                },
            },
            xaxis: {
                type: 'datetime',
                title: { text: 'Day' },
                min: startDate.getTime(),
                max: endDate.getTime(),
                labels: {
                    formatter: (value: number) => dayjs(value).format('MM/DD') // For x-axis labels
                },
                // tickAmount: dayjs(endDate).date() // Number of ticks on the x-axis
            },
            yaxis: {
                title: { text: 'Sleep Duration (hrs)' },
                min: 0
            },
            tooltip: {
                x: {
                    formatter: (value: number) => dayjs(value).format('MMM DD, YYYY')
                }
            },
            storke: {
                connectNulls: true
            },
            legend: {
                position: 'bottom'
            },
            // grid : {
            //     borderColor: '#F0F0F0'
            // },
            colors: ['#1F3863', '#8FAADD', '#2E5598', '#B4C7E7'],
            fill: {
                opacity: 1
            },
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
            annotations: {
                xaxis: [
                    {
                        x: startDate.getTime(),
                        x2: endDate.getTime(),
                        borderColor: '#999',
                        fillColor: '#F3F3F3',
                        opacity: 0.2
                    }
                ]
            }
        });

        // setChartSeries([
        //     { name: 'REM Sleep', data: remsleepData },
        //     { name: 'Light Sleep', data: lightsleepData },
        //     { name: 'Deep Sleep', data: deepsleepData,
        //     { name: 'Awake', data: sleepdurData }
        // ]);
        setChartSeries([
            {
                name: 'REM Sleep',
                data: remsleepData.map(item => ({ x: item.x, y: item.y ?? 0 }))
            },
            {
                name: 'Light Sleep',
                data: lightsleepData.map(item => ({ x: item.x, y: item.y ?? 0 }))
            },
            {
                name: 'Deep Sleep',
                data: deepsleepData.map(item => ({ x: item.x, y: item.y ?? 0 }))
            },
            {
                name: 'Awake',
                data: sleepdurData.map(item => ({ x: item.x, y: item.y ?? 0 }))
            }
        ]);
    }, [sleepDataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="bar" height={400} />
        </div>
    );
};


interface TempChartProps {
    tempDataProps: { StartTime: string; Body: number; }[];
}

const TemperatureChart: React.FC<TempChartProps> = ({ tempDataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: number; y: number }[] }[]>([]);

    useEffect(() => {
        if (!tempDataProps) {
            console.error('tempDataProps is empty or undefined');
            return;
        }
        const temperatureData = tempDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: item.Body
        }));

        const startDate = new Date(tempDataProps[0].StartTime);
        const endDate = new Date(tempDataProps[tempDataProps.length - 1].StartTime);

        setChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    tools: {
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Day'
                },
                min: startDate.getTime(),
                max: endDate.getTime(),
                labels: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MM/DD');
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Temperature (°F)'
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                x: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MMM DD, YYYY hh:mm A');
                    }
                }
            },
            colors: ['#843C0C'],
            stroke: {
                curve: 'smooth',
                width: 3,
                connectNulls: true
            },
            markers: {
                size: 4,
                shape: 'circle',
                opacity: 0.5,
            },
            legend: {
                position: 'bottom'
            },
            grid: {
                borderColor: '#F0F0F0',
            },
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
            annotations: {
                xaxis: [
                    {
                        x: startDate.getTime(),
                        x2: endDate.getTime(),
                        borderColor: '#999',
                        fillColor: '#F3F3F3',
                        opacity: 0.2
                    }
                ]
            }
        });

        setChartSeries([
            {
                name: 'Temperature',
                data: temperatureData
            }
        ]);
    }, [tempDataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={400} />
        </div>
    );
}

interface SpO2ChartProps {
    spo2DataProps: { StartTime: string; SpO2: number }[];
}

const SpO2Chart: React.FC<SpO2ChartProps> = ({ spo2DataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: Date; y: number; }[]; }[]>([]);

    useEffect(() => {
        // Sort data by StartTime
        const sortedData = [...spo2DataProps].sort((a, b) =>
            new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime()
        );

        // Convert data to ApexCharts format
        const spo2Data = sortedData.map(item => ({
            x: new Date(item.StartTime),
            y: item.SpO2
        }));

        setChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Day'
                },
                labels: {
                    datetimeUTC: false,
                    format: 'MM/dd'
                }
            },
            yaxis: {
                title: {
                    text: 'SpO2 (%)'
                }
            },
            tooltip: {
                x: {
                    format: 'MM/dd'
                }
            },
            colors: ['#ff9933', '#3366ff']
        });

        setChartSeries([
            {
                name: 'SpO2',
                data: spo2Data
            }
        ]);
    }, [spo2DataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={400} />
        </div>
    );
}

interface WeightChartProps {
    weightDataProps: { StartTime: string; Weight: number }[];
}

const WeightChart: React.FC<WeightChartProps> = ({ weightDataProps }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState<{ name: string; data: { x: number; y: number | null }[] }[]>([]);

    useEffect(() => {
        if (!weightDataProps || weightDataProps.length === 0) {
            console.error('weightDataProps is empty or undefined');
            return;
        }
        // Convert data to ApexCharts format
        const weightData = weightDataProps.map(item => ({
            x: new Date(item.StartTime).getTime(),
            y: item.Weight
        }));

        const startDate = new Date(weightDataProps[0].StartTime);
        const endDate = new Date(weightDataProps[weightDataProps.length - 1].StartTime);

        setChartOptions({
            chart: {
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true
                },
                toolbar: {
                    tools: {
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Day'
                },
                min: startDate.getTime(),
                max: endDate.getTime(),
                labels: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MM/DD');
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Weight ((Lb))'
                },
                min: 40
            },
            tooltip: {
                enabled: true,
                shared: true,
                x: {
                    formatter: function (value: number) {
                        return dayjs(value).format('MMM DD, YYYY hh:mm A');
                    }
                }
            },
            colors: ['#1F7582'],
            stroke: {
                curve: 'smooth',
                width: 3,
                connectNulls: true
            },
            markers: {
                size: 4,
                shape: 'circle',
                opacity: 0.5,
            },
            legend: {
                position: 'bottom'
            },
            grid: {
                borderColor: '#F0F0F0',
            },
            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            width: '100%'
                        }
                    }
                }
            ],
            annotations: {
                xaxis: [
                    {
                        x: startDate.getTime(),
                        x2: endDate.getTime(),
                        borderColor: '#999',
                        fillColor: '#F3F3F3',
                        opacity: 0.2
                    }
                ]
            }
        });

        setChartSeries([
            {
                name: 'Weight',
                data: weightData
            }
        ]);
    }, [weightDataProps]);

    return (
        <div id="chart_div" style={{ width: '100%', height: '100%' }}>
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={400} />
        </div>
    );
}


export { DailyActivity, RRChart, HRChart, BloodPressureChart, SleepDurationChart, TemperatureChart, WeightChart };