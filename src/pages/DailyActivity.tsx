import { useEffect, useState } from "react";
import MemberProfile from "../assets/daily_activity/member_profile.png";
import axios from "axios";

import NextMemberIcon from "../assets/daily_activity/next_member_icon.png";
import PrevMemberIcon from "../assets/daily_activity/previous_member_icon.png";

import ClockIcon from "../assets/daily_activity/vital_stats/clock.svg";
import AwakeIcon from "../assets/daily_activity/vital_stats/awake.svg";
import PillsIcon from "../assets/daily_activity/vital_stats/pills.svg";
import LocationIcon from "../assets/daily_activity/vital_stats/location.svg";
import SleepIcon from "../assets/daily_activity/vital_stats/sleep.svg";
import FoodIcon from "../assets/daily_activity/vital_stats/food.svg";
import FallIcon from "../assets/daily_activity/vital_stats/fall.svg";
import BPMIcon from "../assets/daily_activity/vital_stats/bpm.svg";

import PaperClip from "../assets/daily_activity/paper_clip.png";
import CreateHealthNotesIcon from "../assets/daily_activity/addHealthNotes.png";

import img_arrow from "../assets/arrows/right.svg";

import CreateDailyNotesIcon from "../assets/daily_activity/create_daily_notes_icon.png";
import DeleteDailyNotesIcon from "../assets/daily_activity/delete_daily_notes_icon.png";
import EditDailyNotesIcon from "../assets/daily_activity/edit_daily_notes_icon.png";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

import Charts from "../components/Charts";
import DAP_Alerts from "../components/DAP_Alerts";

interface Member {
  hccId: number;
  firstName: string;
  lastName: string;
  clientId: number;
  dob: string;
  primaryPhone: string;
  productKitId: number;
}

interface MemberStatus {
  Monitoring: number;
  Sensor: number;
  Hub: number;
}

interface MemberVitals {
  WakeupTime: string;
  WanderDuration: string;
  MedicationCount: number;
  Location: number;
  sleepDuration: string;
  Diningount: number;
  FallCount: number;
  BloodPressure: number;
}

interface HealthNotes {
  healthConcerns: string;
  specialInstructions: string;
  notes: string[];
}

interface DailyNotes {
  enteredBy: string;
  enteredNotes: string;
  instruction: string;
  createDate: string;
  BloodPressureSystolic: number;
  BloodPressureDiastolic: number;
  Weight: number;
  Temperature: number;
  BloodOxygen: number;
  Falls: number;
}

const DailyActivity: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [memberDetails, setMemberDetails] = useState<Member[]>([]);
    const [memberStatus, setMemberStatus] = useState<MemberStatus | null>(null)
    const [memberVitals, setMemberVitals] = useState<MemberVitals | null>(null);
    const [healthNotes, setHealthNotes] = useState<HealthNotes | null>(null);
    const [dailyNotes, setDailyNotes] = useState<DailyNotes[] | null>(null);
    const alertDate = "2024-11-11";
    // const alertClientId = 178;

  useEffect(() => {
    fetchMemberDetails();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchMemberStatus(selectedMember.clientId);
      fetchMemberVitalStats(selectedMember.clientId);
      fetchHealthNotes(selectedMember.clientId);
      fetchDailyNotes(selectedMember.clientId);
    }
  }, [selectedMember]);

  useEffect(() => {
    if (memberDetails.length > 0) {
      setSelectedMember(memberDetails[currentIndex]);
    }
  }, [currentIndex, memberDetails]);

  const handleNextMember = () => {
    if (currentIndex < memberDetails.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

    const handlePrevMember = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

  const fetchMemberDetails = async (): Promise<void> => {
    try {
      const response = await axios.get<Member[]>(
        "http://localhost:3000/api/v1/daily-activity/member-details"
      );
      const memberDetails = response.data;

      console.log("********Member Details ***********");
      console.log(memberDetails);

      setMemberDetails(memberDetails);
      setSelectedMember(memberDetails[0]);

      console.log("Done fetching member details");
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  };

  const fetchMemberStatus = async (clientId: number): Promise<void> => {
    try {
      const response = await axios.get<MemberStatus>(
        "http://localhost:3000/api/v1/daily-activity/member-status",
        {
          params: { clientId },
        }
      );

      const memberStatus = response.data;

      console.log("********Member Details ***********");
      console.log(memberStatus);
      setMemberStatus(memberStatus);
      console.log("Done fetching member status");
    } catch (error) {
      console.error("Error fetching member status:", error);
    }
  };

  const fetchMemberVitalStats = async (clientId: number): Promise<void> => {
    try {
      const response = await axios.get<MemberVitals>(
        "http://localhost:3000/api/v1/daily-activity/vital-stats",
        {
          params: { clientId },
        }
      );

      const vitalStats = response.data;

      console.log("********Member Details ***********");
      console.log(vitalStats);

      setMemberVitals(vitalStats);
      console.log("Done fetching member vital stats");
    } catch (error) {
      console.error("Error fetching member vital stats:", error);
    }
  };

  const fetchHealthNotes = async (clientId: number): Promise<void> => {
    try {
      const response = await axios.get<HealthNotes>(
        "http://localhost:3000/api/v1/daily-activity/health-notes",
        {
          params: { clientId },
        }
      );

      const healthNotes = response.data;

      console.log("******** Health Notes ***********");
      console.log(healthNotes);

      setHealthNotes(healthNotes);
      console.log("Done fetching Health Notes");
    } catch (error) {
      console.error("Error fetching Health Notes:", error);
    }
  };

  const fetchDailyNotes = async (clientId: number): Promise<void> => {
    try {
      const response = await axios.get<DailyNotes[]>(
        "http://localhost:3000/api/v1/daily-notes/fetch",
        {
          params: { clientId },
        }
      );

      const dailyNotes = response.data;

      console.log("******** Daily Notes ***********");
      console.log(dailyNotes);

      setDailyNotes(dailyNotes);
      console.log("Done fetching Daily Notes");
    } catch (error) {
      console.error("Error fetching Daily Notes:", error);
    }
  };

  return (
    <div
      className={`dailyActivity_container w-full h-[856px] transition-all duration-300 ease-in-out overflow-auto`}
    >
      <div className="border border-solid-3 w-64 my-4 ml-4">
        <Listbox value={selectedMember} onChange={setSelectedMember}>
          <ListboxButton
            className={clsx(
              "relative block w-full rounded-lg bg-white-100 py-1 pr-8 pl-3 text-left text-sm/6 text-black",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-blue"
            )}
          >
            {selectedMember
              ? `${selectedMember.firstName} ${selectedMember.lastName}`
              : "Select a member"}
            <ChevronDownIcon
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
              aria-hidden="true"
            />
          </ListboxButton>
          <ListboxOptions
            anchor="top"
            transition
            className={clsx(
              "absolute z-10 w-64 mt-2 rounded-sm border border-solid-2 bg-gray-100 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-1  focus:outline-blue",
              "transition duration ease-in data-[leave]:data-[closed]:opacity-0"
            )}
          >
            {memberDetails.map((person) => (
              <ListboxOption
                key={person.clientId}
                value={person}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-200"
              >
                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-sm/6 text-black">
                  {person.lastName} {person.firstName}, {person.clientId}
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
      <div className="memberDetails_Calendar grid grid-cols-1 sm:grid-cols-4 gap-6 p-4">
        <div className="profile_section bg-[#333333] text-white p-4 rounded-sm w-full sm:w-[425px]">
          <div className="flex justify-between">
            <button
              className="p-1 top-0 left-0 bg-white rounded-2xl"
              onClick={handlePrevMember}
            >
              <img src={PrevMemberIcon} className="w-6 h-6" />
            </button>
            <button
              className="p-1 top-0 right-0 bg-white rounded-2xl"
              onClick={handleNextMember}
            >
              <img src={NextMemberIcon} className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center">
            <img
              src={MemberProfile}
              alt="Profile"
              className="w-24 h-24 rounded-full mr-4 m-4"
            />
            {selectedMember && (
              <div className="ml-2 flex-row justify-items-stretch">
                <h2 className="text-lg font-bold mb-2">{`${selectedMember.lastName}, ${selectedMember.firstName}`}</h2>
                <div className="text-base space-y-2">
                  <p className="text-[#acacac]">
                    Member ID:{" "}
                    <span className="text-white ml-1">
                      {selectedMember.clientId}
                    </span>
                  </p>
                  <p className="text-[#acacac]">
                    DOB:{" "}
                    <span className="text-white ml-1">
                      {selectedMember.dob.split("T")[0]}
                    </span>
                  </p>
                  <p className="text-[#acacac]">
                    Phone:{" "}
                    <span className="text-white ml-1">
                      {selectedMember.primaryPhone}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="status_section mt-4 bg-white text-black p-2 rounded-sm flex flex-wrap">
            {selectedMember && memberStatus && (
              <>
                <p className="mr-4 text-sm">
                  Monitoring Status{" "}
                  <span className="text-green-500 ml-2 ">
                    {memberStatus.Monitoring === 1 ? "YES" : "NO"}
                  </span>
                </p>
                <p className="mr-4 text-sm">
                  Sensor Status{" "}
                  <span className="text-green-500 ml-2">
                    {memberStatus.Sensor === 1 ? "YES" : "NO"}
                  </span>
                </p>
                <p className="text-sm">
                  Hub Status{" "}
                  <span className="text-green-500 ml-2">
                    {memberStatus.Hub === 1 ? "YES" : "NO"}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
        {selectedMember && (
          <div className="vital_stats_section grid grid-cols-4 gap-8 p-4 text-sm">
            <div className="flex flex-col items-center">
              <img src={ClockIcon} alt="Clock" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.WakeupTime : "--"}(h)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={AwakeIcon} alt="Walking" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.WanderDuration : "--"}(h)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={PillsIcon} alt="Pills" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.MedicationCount : "--"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={LocationIcon} alt="Location" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.Location : "--"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={SleepIcon} alt="Sleep" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.sleepDuration : "--"}(h)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={FoodIcon} alt="Meal" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.Diningount : "--"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={FallIcon} alt="FallCount" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.FallCount : "--"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img src={BPMIcon} alt="Health" className="w-12 h-12" />
              <p className="mt-2">
                {memberVitals ? memberVitals.BloodPressure : "--"}(bpm)
              </p>
            </div>
          </div>
        )}
        <div className="health_notes_section bg-[#ffc4cc] w-[400px] pt-3 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <img src={PaperClip} alt="Paperclip" className="w-8 h-8 mr-2" />
              <h2 className="text-lg text-black">Health Notes</h2>
            </div>
            <img
              src={CreateHealthNotesIcon}
              alt="Create Health Notes"
              className="w-6 h-6 mr-4 hover:cursor-pointer"
            />
          </div>

          {healthNotes && (
            <div className="bg-[#fae1e7] h-56 p-4 overflow-y-auto text-sm">
              <p>
                <strong>Primary Health Concerns:</strong>
              </p>
              <pre className="whitespace-pre-wrap">
                {healthNotes.healthConcerns}
              </pre>
              <p>
                <strong>Special Instructions:</strong>
              </p>
              <pre className="whitespace-pre-wrap">
                {healthNotes.specialInstructions}
              </pre>
              <p>
                <strong>Notes:</strong>
              </p>
              <ul className="list-disc pl-5">
                {healthNotes.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="calendar_section flex flex-row p-4 mr-4 w-96 bg-lime-200">
          <h2 className="text-2xl">Calendar Widget:-</h2>
        </div>
      </div>

      {/* second row */}
      <section className="graph_section flex mr-4 mt-2">
        <div className="flex-grow p-4  ">
          {selectedMember && (
            <Charts clientId={selectedMember.clientId} date={alertDate} />
          )}
          {selectedMember && (
            <DAP_Alerts clientId={selectedMember.clientId} date={alertDate} />
          )}
        </div>

        <div
          className={`relative transition-all duration-300 max-h-[1300px] overflow-auto ${
            isExpanded ? "w-1/4" : "w-8"
          } bg-[#FAFBFF]`}
        >
          <button
            onClick={togglePanel}
            className="absolute top-4 mr-6  w-10 h-10 bg-[#333333] flex items-center justify-center"
          >
            <img
              src={img_arrow}
              className={`transition-transform duration-1000 ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
              alt="Toggle Arrow"
            />
          </button>

                    {isExpanded && (
                        <div className="daily_notes_section p-4">
                            <div className="daily_notes_header flex justify-between">
                                <h2 className="text-xl font-semibold mb-2 ml-10">Daily Notes</h2>
                                <div className="w-36 mr-4 flex justify-between items-center rounded bg-[#26a6fe] py-2 px-4 hover:bg-sky-500 active:bg-sky-700 cursor-pointer">
                                    <img src={CreateDailyNotesIcon} className='w-[18px] h-[18px]' alt="Create Note" />
                                    <span className='text-base font-sans text-white'>Create Note</span>
                                </div>
                            </div>
                            {dailyNotes && (
                                <div className="notes_list text-base">
                                    {dailyNotes.map((note, index) => (
                                        <div key={index} className="daily_notes_card bg-white shadow-md p-4 mb-4 rounded leading-loose text-gray-500">
                                            <p><span className='font-medium text-black'>Notes:</span> {note.enteredNotes}</p>
                                            <p><span className='font-medium text-black'>Caregiver Instructions:</span> {note.instruction}</p>
                                            <p><span className='font-medium text-black'>Blood Pressure(mm/Hg):</span> {note.BloodPressureSystolic}/{note.BloodPressureDiastolic}</p>
                                            <p><span className='font-medium text-black'>Weight(lbs):</span>{note.Weight}</p>
                                            <p><span className='font-medium text-black'>Temperature (F):</span> {note.Temperature}</p>
                                            <p><span className='font-medium text-black'>Blood Oxygen (SpO2):</span> {note.BloodOxygen}</p>
                                            <p><span className='font-medium text-black'>Falls:</span> {note.Falls}</p>
                                            <div className='daily_notes_card_footer flex justify-between items-center'>
                                                <p className="text-gray-500 text-[15px] left-0">
                                                    Date Created: {note.createDate ? new Date(note.createDate).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true
                                                    }) : ''}
                                                </p>
                                                <div className="flex justify-between items-center w-16">
                                                    <button>
                                                        <img src={DeleteDailyNotesIcon} alt="Delete" className="w-5 h-5 hover:opacity-75" />
                                                    </button>
                                                    <button className="mr-2">
                                                        <img src={EditDailyNotesIcon} alt="Edit" className="w-5 h-5 hover:opacity-75" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

        </div>
    );

};

export default DailyActivity;
