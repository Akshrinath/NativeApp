import { useState, useEffect } from 'react';
import axios from 'axios';
import { DailyActivity, RRChart, HRChart, BloodPressureChart, SleepDurationChart, TemperatureChart, WeightChart } from './VitalsChart';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'


interface SleepData {
    [date: string]: {
        lightsleepduration: number;
        sleepdur: number;
        deepsleepduration: number;
        remsleepduration: number;
    };
}
interface sensorList {
    name: string;
    color: string;
}
export function Charts({ clientId, date }: { clientId: number; date: string }) {

    const [dataFeed, setDataFeed] = useState<string[][]>([]);
    const [colorLine, setColorLine] = useState<string[]>([]);
    const [sensorsList, setSensorsList] = useState<sensorList[]>([]);
    const [rrData, setRRData] = useState<Array<{ rr: number; StartTime: string }>>([]);
    const [hrData, setHRData] = useState<Array<{ hr: number; StartTime: string }>>([]);
    const [bpData, setBPData] = useState<Array<{ Diastolic: number; StartTime: string; Systolic: number }>>([]);
    const [sleepData, setSleepData] = useState<SleepData>({});
    const [tempData, setTempData] = useState<Array<{ Body: number; StartTime: string }>>([]);
    // const [oxygenData, setOxygenData] = useState<Array<{ oxygen: number; StartTime: string }>>([]);
    const [weightData, setWeightData] = useState<Array<{ Weight: number; StartTime: string }>>([]);

    // const clientId = 552;
    // const date = "2024-11-11";

    const fetchData = async () => {
        try {
            const [
                responseBehavior,
                responseRR,
                responseHR,
                responseBP,
                responseSleep,
                responseTemp,
                responseWeight,
                // responseOxygen
            ] = await Promise.all([
                axios.get(`http://localhost:3000/api/v1/daily-activity/behavior-details`, {
                    params: { clientId, date }
                }),
                axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/respiratory-rate`, {
                    params: { clientId, date }
                }),
                axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/heart-rate`, {
                    params: { clientId, date }
                }),
                axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/bloodpressure`, {
                    params: { clientId, date }
                }),
                axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/sleep`, {
                    params: { clientId, date }
                }),
                axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/temperature`, {
                    params: { clientId, date }
                }),
                axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/weight`, {
                    params: { clientId, date }
                }),
                // axios.get(`http://localhost:3000/api/v1/daily-activity/vital-details/oxygen`, {
                //     params: { clientId, date }
                // })
            ]);

            setDataFeed(responseBehavior.data.dataFeed);
            setColorLine(responseBehavior.data.colorLine);
            setSensorsList(responseBehavior.data.sensorsList);
            setRRData(responseRR.data);
            setHRData(responseHR.data);
            setBPData(responseBP.data);
            setSleepData(responseSleep.data);
            setTempData(responseTemp.data);
            setWeightData(responseWeight.data);
            // setOxygenData(responseOxygen.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [clientId, date]);

    return (
        <div className="flex w-full">
            <div className="w-full ">

                <TabGroup className="border-x-2 border-b-2 ">
                    <TabList className="flex w-full">
                        <Tab
                            className={({ selected }) =>
                                `flex-1 py-2 px-4 text-base font-semibold text-center ${selected ? 'bg-[#333333] text-white' : 'bg-white text-gray-500 border-y-2'}`
                            }
                        >
                            Activity
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                `flex-1 py-2 px-4 text-base font-semibold text-center ${selected ? 'bg-[#333333] text-white' : 'bg-white text-gray-500 border-y-2'}`
                            }
                        >
                            Vitals
                        </Tab>
                    </TabList>
                    <TabPanels className="mt-3 h-[450px] overflow-y-auto">
                        <TabPanel className="rounded-xl bg-white/5 p-3">
                            {/* Activity content goes here */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold mb-2">Activity Graph</h2>
                                <DailyActivity dataFeed={dataFeed} colorLine={colorLine} sensorsList={sensorsList} />
                            </div>
                        </TabPanel>
                        <TabPanel className="rounded-xl bg-white/5 h-[450px] overflow-y-auto">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Vitals content goes here */}
                                <div className="bg-white mx-4 rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold mb-2">Respiratory Rate</h2>
                                    <RRChart rrDataProps={rrData} />
                                </div>
                                <div className="bg-white mx-4 rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold mb-2">Heart Rate</h2>
                                    <HRChart hrDataProps={hrData} />
                                </div>
                                <div className="bg-white mx-4 rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold mb-2">Blood Pressure</h2>
                                    <BloodPressureChart bpDataProps={bpData} />
                                </div>
                                <div className="bg-white mx-4 rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold mb-2">Sleep</h2>
                                    <SleepDurationChart sleepDataProps={sleepData} />
                                </div>

                                <div className="bg-white mx-4 rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold mb-2">Temperature</h2>
                                    <TemperatureChart tempDataProps={tempData} />
                                </div>
                                {/*
                                    <div className="bg-white mx-4 rounded-lg shadow-md">
                                        <h2 className="text-lg font-semibold mb-2">Oxygen</h2>
                                        <RRChart oxygenDataProps={oxygenData} />
                                    </div>
                                    */}
                                <div className="bg-white mx-4 rounded-lg shadow-md">
                                    <h2 className="text-lg font-semibold mb-2">Weight</h2>
                                    <WeightChart weightDataProps={weightData} />
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>

            </div>
        </div>
    );
};


export default Charts;