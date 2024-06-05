'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import { IoSearch } from 'react-icons/io5';

const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Home() {
  const [points, setPoints] = useState(0);
  const [address, setAddress] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [eventName, setEventName] = useState('');
  const [targetEventName, setTargetEventName] = useState('');
  const [status, setStatus] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [totalPoint, setTotalPoint] = useState(-1);
  const [eventInfoName, setEventInfoName] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  const [metadata, setMetadata] = useState('');

  const registerApiKey = async () => {
    try {
      const keyDataRes = await axios.post(BASE_URL + '/register');
      setApiKey(keyDataRes.data.apiKey);
    } catch (error) {
      console.error(error);
    }
  }

  const initializeProject = async () => {
    try {
      const projectDataRes = await axios.post(BASE_URL + '/initialize', {}, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      setCampaignId(projectDataRes.data.campaignId)
    } catch (error) {
      console.error(error);
    }
  }

  const distributePoints = async () => {
    try {
      const pointsDataRes = await axios.post(BASE_URL + '/distribute', {
        eventName: eventName,
        pointsData: {
          points,
          address
        }
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      setStatus(pointsDataRes.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  const readPoints = async () => {
    try {
      const pointsDataRes = await axios(BASE_URL + '/points/' + targetAddress + (targetEventName.length > 0 ? '/' + targetEventName : ''), {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      setTotalPoint(pointsDataRes.data)
    } catch (error) {
      console.error(error);
    }
  }

  const updateEventData = async () => {
    try {
      const pointsDataRes = await axios.post(BASE_URL + '/update_event', {
        eventName: eventInfoName,
        eventData: {
          timestamp: new Date(timeStamp).valueOf(),
          metadata
        }
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      setEventStatus(pointsDataRes.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  const readEventMetadata = async () => {
    try {
      const eventDataRes = await axios(BASE_URL + '/event/' + eventInfoName);
      const eventData = eventDataRes.data;
      if (eventData && eventData.event_name) {
        const date = new Date(Number(eventData.timestamp))
        setTimeStamp(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,-8))
        setMetadata(eventData.metadata)
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setStatus('');
  }, [apiKey, campaignId, eventName, points, address]);

  useEffect(() => {
    setTotalPoint(-1);
  }, [apiKey, campaignId, targetAddress, targetEventName]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <button
        className='self-center px-6 py-2 border rounded hover:bg-sky-700'
        onClick={() => registerApiKey()}
      >
        Register
      </button>
      <div className='flex items-center mt-4'>
        <div className='mr-3 w-48'>API Key:</div>
        <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
          <IoSearch size={16} color='#242F42' />
          <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='API Key' value={apiKey} onChange={e => setApiKey(e.target.value)} />
        </div>
      </div>
      <button
        className='self-center px-6 py-2 border rounded hover:bg-sky-700'
        onClick={() => initializeProject()}
      >
        Initialize
      </button>
      <div className='flex items-center mt-4'>
        <div className='mr-3 w-48'>Campaign Id:</div>
        <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
          <IoSearch size={16} color='#242F42' />
          <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' disabled placeholder='Campaign Id' value={campaignId} onChange={e => setCampaignId(e.target.value)} />
        </div>
      </div>

      <div className='flex flex-row gap-8'>
        <div className='flex flex-col'>
          <div className='flex items-center mt-4'>
            <div className='mr-3 w-48'>Event Name:</div>
            <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
              <IoSearch size={16} color='#242F42' />
              <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Event Name' value={eventName} onChange={e => setEventName(e.target.value)} />
            </div>
          </div>
          <div className='flex items-center mt-4'>
            <div className='mr-3 w-48'>Point:</div>
            <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
              <IoSearch size={16} color='#242F42' />
              <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Points' value={points} onChange={e => setPoints(Number(e.target.value))} />
            </div>
          </div>
          <div className='flex items-center mt-4'>
            <div className='mr-3 w-48'>Wallet Address:</div>
            <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
              <IoSearch size={16} color='#242F42' />
              <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Wallet Address' value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          {status.length > 0 && (
            <div className='text-green-500 mt-4'>{status}</div>
          )}
          <button
            className='self-center mt-4 px-6 py-2 border rounded hover:bg-sky-700'
            onClick={() => distributePoints()}
          >
            Distribute
          </button>
        </div>
        <div className='flex flex-col'>
          <div className='flex items-center mt-4'>
            <div className='mr-3 w-48'>Target Wallet Address:</div>
            <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
              <IoSearch size={16} color='#242F42' />
              <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Wallet Address' value={targetAddress} onChange={e => setTargetAddress(e.target.value)} />
            </div>
          </div>
          
          <div className='flex items-center mt-4'>
            <div className='mr-3 w-48'>Target Event Name:</div>
            <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
              <IoSearch size={16} color='#242F42' />
              <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Event Name' value={targetEventName} onChange={e => setTargetEventName(e.target.value)} />
            </div>
          </div>
          {totalPoint >= 0 && (
            <div className='text-green-500 mt-4'>{totalPoint}</div>
          )}
          <button
            className='self-center mt-4 px-6 py-2 border rounded hover:bg-sky-700'
            onClick={() => readPoints()}
          >
            Read Points
          </button>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='flex items-center mt-4'>
          <div className='mr-3 w-48'>Event Name:</div>
          <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
            <IoSearch size={16} color='#242F42' />
            <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Event Name' value={eventInfoName} onChange={e => setEventInfoName(e.target.value)} />
          </div>
        </div>
        <div className='flex items-center mt-4'>
          <div className='mr-3 w-48'>Timestamp:</div>
          <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
            <IoSearch size={16} color='#242F42' />
            <input type='datetime-local' className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Timestamp' value={timeStamp} onChange={e => setTimeStamp(e.target.value)} />
          </div>
        </div>
        <div className='flex items-center mt-4'>
          <div className='mr-3 w-48'>Metadata:</div>
          <div className='flex items-center border rounded border-gray-400 py-1 px-2 focus-within:border-sky-500 focus-within:shadow-lg'>
            <IoSearch size={16} color='#242F42' />
            <input className='!outline-none ml-2 max-w-screen-md bg-black w-80' placeholder='Metadata' value={metadata} onChange={e => setMetadata(e.target.value)} />
          </div>
        </div>
        {eventStatus.length > 0 && (
          <div className='text-green-500 mt-4'>{eventStatus}</div>
        )}
        <div className='flex justify-center gap-4'>
          <button
            className='self-center mt-4 px-6 py-2 border rounded hover:bg-sky-700'
            onClick={() => updateEventData()}
          >
            Update Event
          </button>
          <button
            className='self-center mt-4 px-6 py-2 border rounded hover:bg-sky-700'
            onClick={() => readEventMetadata()}
          >
            Get Event
          </button>
        </div>
      </div>
    </main>
  );
}
