import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

interface ClientAlert {
    clientId: number;
    type: string;
    sensorName: string;
    alertTime: string | null;
    resolutionTime: string | null;
    severity: number;
    alertNotes: string;
    resoID: number;
    id: number;
}

export function DAP_Alerts({ clientId, date }: { clientId: number; date: string }) {
    const [activityAlert, setActivityAlert] = useState<ClientAlert[] | null>(null);
    const [healthAlert, setHealthAlert] = useState<ClientAlert[] | null>(null);
    const [resolvedAlert, setResolvedAlert] = useState<ClientAlert[] | null>(null);

    const [currentAlerts, setCurrentAlerts] = useState<ClientAlert[] | null>(null);
    const [activeTab, setActiveTab] = useState<number>(0);

    const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const fetchClientActivityAlert = async (clientId: number, date: string): Promise<void> => {
        try {
            const response = await axios.get<ClientAlert[]>('http://localhost:3000/api/v1/alerts/client-activity-alerts', {
                params: { clientId, date }
            });

            console.log("clientid", clientId, "date", date);

            const activityAlert = response.data;

            console.log('******** Activity Alert ***********');
            console.log(activityAlert);

            setActivityAlert(activityAlert);
            console.log('Done fetching Activity Alert');
        } catch (error) {
            console.error('Error fetching Activity Alert:', error);
        }
    };

    const fetchClientHealthAlert = async (clientId: number, date: string): Promise<void> => {
        try {
            const response = await axios.get<ClientAlert[]>('http://localhost:3000/api/v1/alerts/client-health-alerts', {
                params: { clientId, date }
            });

            console.log("clientid", clientId, "date", date);

            const healthAlert = response.data;

            console.log('******** Health Alert ***********');
            console.log(healthAlert);

            setHealthAlert(healthAlert);
            console.log('Done fetching Health Alert');
        } catch (error) {
            console.error('Error fetching Health Alert:', error);
        }
    };

    const fetchClientResolvedAlert = async (clientId: number, date: string): Promise<void> => {
        try {
            const response = await axios.get<ClientAlert[]>('http://localhost:3000/api/v1/alerts/client-resolved-alerts', {
                params: { clientId, date }
            });

            console.log("clientid", clientId, "date", date);

            const resolvedAlert = response.data;

            console.log('******** Resolved Alert ***********');
            console.log(resolvedAlert);

            setResolvedAlert(resolvedAlert);
            console.log('Done fetching Resolved Alert');
        } catch (error) {
            console.error('Error fetching Resolved Alert:', error);
        }
    };

    const handleTabChange = async (index: number) => {
        console.log('Tab changed to:', index);
        setActiveTab(index);
        console.log('Active Tab:', activeTab);
        switch (index) {
            case 0:
                await fetchClientActivityAlert(clientId, date);
                break;
            case 1:
                await fetchClientHealthAlert(clientId, date);
                break;
            case 2:
                await fetchClientResolvedAlert(clientId, date);
                break;
            default:
                setCurrentAlerts(null);
        }
        console.log("End of handle tab change");
    };

    useEffect(() => {
        switch (activeTab) {
            case 0:
                setCurrentAlerts(activityAlert);
                break;
            case 1:
                setCurrentAlerts(healthAlert);
                break;
            case 2:
                console.log("resolvedAlert use-effect", resolvedAlert);
                setCurrentAlerts(resolvedAlert);
                break;
            default:
                setCurrentAlerts(null);
        }
    }, [activityAlert, healthAlert, resolvedAlert, activeTab]);

    const handleCheckboxChange = (id: number) => {
        setSelectedAlerts(prev =>
            prev.includes(id) ? prev.filter(alertId => alertId !== id) : [...prev, id]
        );
    };

    const handleCreateNote = () => {
        console.log('Creating note for alerts:');
        setIsPopupOpen(false);
    };

    useEffect(() => {
        fetchClientActivityAlert(clientId, date);
    }, [clientId, date]);

    const AlertTable = ({ alerts }: { alerts: ClientAlert[] | null }) => {
        console.log('Rendering AlertTable with alerts:', alerts);
        return (
            <>
                <table className="alerts-table w-full border-3 overflow-x-auto">
                    <thead>
                        <tr className="text-left">
                            <th className="p-2 border w-28"></th>
                            <th className="p-2 border">Alert Type</th>
                            <th className="p-2 border">Last Known Location</th>
                            <th className="p-2 border">Alert Time</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Resolution Time</th>
                            <th className="p-2 border">Alert ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts && alerts.map(alert => (
                            <tr key={alert.id} className="border-t">
                                <td className="p-2 border">
                                    <input
                                        type="checkbox"
                                        className='h-6 w-8 border-r-4'
                                        onChange={() => handleCheckboxChange(alert.id)}
                                        checked={selectedAlerts.includes(alert.id)}
                                    />
                                </td>
                                <td className="p-2 border">{alert.type}</td>
                                <td className="p-2 border">Bedroom</td>
                                <td className="p-2 border">{alert.alertTime ? dayjs(alert.alertTime).format('YYYY-MM-DD hh:mm:ss A') : "-"}</td>
                                <td className="p-2 border">{alert.resoID == -1 ? "Open" : "-"}</td>
                                <td className="p-2 border">{alert.resolutionTime ? dayjs(alert.resolutionTime).format('YYYY-MM-DD hh:mm:ss A') : "-"}</td>
                                <td className="p-2 border text-[#f72585] underline hover:cursor-pointer" onClick={() => setIsPopupOpen(true)}>{alert.id}</td>
                                {isPopupOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center">
                                        <div className="rounded shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
                                            <div className="flex">
                                                {/* Left Side: Alert Details */}
                                                <div className="w-1/3 p-4 border-r leading-loose bg-[#333333] text-white">
                                                    <p><strong className='text-[#adadad]'>Alert ID:</strong> 1063885</p>
                                                    <p><strong className='text-[#adadad]'>Alert For:</strong> Jeanette Coltharp</p>
                                                    <p><strong className='text-[#adadad]'>Alert Time:</strong> 07-25-2024 10:02:37 AM</p>
                                                    <p><strong className='text-[#adadad]'>Type:</strong> Chair Exit</p>
                                                    <p><strong className='text-[#adadad]'>Sensor Name:</strong> Living room chair mat</p>
                                                    <p><strong className='text-[#adadad]'>Alert Description:</strong> Alert description <a href="#" className="text-blue-500">View Details</a></p>
                                                    <p><strong className='text-[#adadad]'>Open Events:</strong> 98</p>
                                                    <p><strong className='text-[#adadad]'>Open Alerts:</strong> 06</p>
                                                </div>

                                                {/* Right Side: Note Creation Form */}
                                                <div className="w-3/4 p-4 bg-white">
                                                    <h2 className="text-lg font-semibold mb-4">Create Note</h2>
                                                    <div className="mb-4 flex items-center text-[#333333]">
                                                        <label className="block text-sm font-medium text-[#333333]">Resolution</label>
                                                        <select className="mt-1 block w-44 bg-white rounded-md p-2 ml-8">
                                                            <option>Open</option>                                                            
                                                        </select>
                                                    </div>
                                                    <div className="mb-4 flex">
                                                        <label className="block text-sm font-medium text-[#333333]">Select Note</label>
                                                        <select className="mt-1 block w-44 bg-white rounded-md p-2 ml-8">
                                                            <option>Open</option>                    
                                                        </select>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-[#333333]">Note Summary</label>
                                                        <textarea
                                                            className="mt-1 block w-full bg-white rounded-md p-2"
                                                            rows={3}
                                                            placeholder="Open"
                                                        />
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <div className="flex items-center mb-4">
                                                            <input type="checkbox" className="mr-2 h-6 w-6" />
                                                            <label className="text-sm">Copy Agent Note To Daily Notes</label>
                                                        </div>
                                                        <div className="flex items-center mb-4">
                                                            <input type="checkbox" className="mr-2 h-6 w-6" />
                                                            <label className="text-sm">Dismiss/ Resolve Related Events/ Alerts</label>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-md font-semibold mb-2">Resolution Notes</h3>
                                                    <div className="mb-4">
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border p-2">Resolution Name</th>
                                                                    <th className="border p-2">Resolution Notes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2">-</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2">-</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-4">To view all resolution notes, Go to <a href="#" className="text-blue-500">Resolution Note</a></p>
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={handleCreateNote}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                                        >
                                                            Submit
                                                        </button>
                                                        <button
                                                            onClick={() => setIsPopupOpen(false)}
                                                            className="bg-gray-300 text-black px-4 py-2 rounded"
                                                        >
                                                            Exit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table >
                {
                    selectedAlerts.length > 0 && ( 
                        <div className="flex justify-end mt-4">
                            <button className="bg-[#333333] text-white px-4 py-2 mr-2 rounded-xl">Resolve as sensor issue</button>
                            <button className="bg-[#26a6fe] text-white px-4 py-2 rounded-xl">Resolve as OK</button>
                        </div>
                    )
                }
            </>
        );
    };

    return (
        <div className="alerts-container mt-4 w-full">
            <div className="border-x-2 border-b-2 min-h-96">
                <div className="flex flex-col md:flex-row w-full">
                    <button
                        className={`flex-1 py-2 px-4 text-base font-semibold text-center ${activeTab === 0 ? 'bg-[#333333] text-white' : 'bg-white text-gray-500 border-2'} md:mr-2 mb-2 md:mb-0`}
                        onClick={() => handleTabChange(0)}
                    >
                        Activity Alerts
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-base font-semibold text-center ${activeTab === 1 ? 'bg-[#333333] text-white' : 'bg-white text-gray-500 border-y-2'} md:mr-2 mb-2 md:mb-0`}
                        onClick={() => handleTabChange(1)}
                    >
                        Health Alerts
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-base font-semibold text-center ${activeTab === 2 ? 'bg-[#333333] text-white' : 'bg-white text-gray-500 border-2'}`}
                        onClick={() => handleTabChange(2)}
                    >
                        Resolved Alerts
                    </button>
                </div>
                <div className="p-2">
                    {activeTab === 0 && <AlertTable alerts={activityAlert} />}
                    {activeTab === 1 && <AlertTable alerts={healthAlert} />}
                    {activeTab === 2 && <AlertTable alerts={resolvedAlert} />}
                </div>
            </div>
        </div>
    );
}

export default DAP_Alerts;