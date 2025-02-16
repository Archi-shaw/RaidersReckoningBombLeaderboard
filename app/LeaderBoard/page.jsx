"use client";
import React, { useState, useEffect } from 'react';
import TeamDetails from "@/app/LeaderBoard/Teamdetails";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Target } from 'lucide-react';
import {translateDataToZones} from "@/app/data/Leaderboard";
import GameTimer from "@/app/GameTimer/page";

const SortableTeam = ({ id, team, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const teamDetails = {
    minutes: 50,
    seconds: 25,
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`p-2 mb-1 rounded-md border transition-all duration-300 ${
        isDragging ? 'scale-105 shadow-xl ring-2 ring-red-500/50' : ''
      } ${
        index === 0
          ? 'bg-red-900/20 border-red-500/20 hover:border-red-500/50'
          : 'bg-gray-900/20 border-gray-500/20 hover:border-gray-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1" {...attributes} {...listeners}>
          <img src='/level.png' alt='levelup' className='w-5 h-5' />
          <span className="tracking-wide font-serif font-extrabold text-sm md:text-base">{team}</span>
        </div>
        <div onClick={(e) => e.stopPropagation()} className='font-dseg7'>
          <TeamDetails team={team} details={teamDetails} index={index} className="" />
        </div>
      </div>
    </li>
  );
};


const SortableZone = ({ zone, zoneIndex }) => {
  const [timeLeft, setTimeLeft] = useState('');




  return (
    <div className='bg-red-900 rounded-lg w-full h-full mx-auto overflow-hidden'> {/* Adjusted width */}
      <div className="bg-black opacity-85 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-red-500/30 hover:border-red-500 transition-all duration-300 shadow-lg relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div>
          <div className="flex items-center justify-between">
            <div className="flex w-full justify-between items-center gap-3 mb-3">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight font-serif">
                <Target className="w-6 h-6 text-red-500"/>
                {zone.name}</h2>
              <span className="font-dseg7 text-2xl text-orange-600 text-shadow-lg shadow-orange-500/50">
                192.168.1.1
              </span>
              <GameTimer initialMinute={15} initialSecond={0}/>
            </div>
          </div>

          <SortableContext
              items={zone.teams.map((team) => `${team}-${zoneIndex}`)}
              strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-1">
              {zone.teams.map((team, index) => (
                <SortableTeam
                  key={`${team}-${zoneIndex}`}
                  id={`${team}-${zoneIndex}`}
                  team={team}

                  index={index}
                  zoneIndex={zoneIndex}
                />
              )).reverse()}
            </ul>
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

const ZonesDisplay = () => {
  const [zones, setZones] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://141.148.219.124:18132/leaderboard');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const newData = await fetchData();
      if (newData) {
        setZones((state)=>{translateDataToZones(newData)});
        console.log(zones[0]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTeamId = active.id.toString();
    const [team, sourceZoneIndex] = activeTeamId.split('-');
    const overZoneId = over.id.toString().split('-')[1];

    if (sourceZoneIndex !== overZoneId) {
      setZones((zones) => {
        const newZones = [...zones];
        const sourceZone = newZones[parseInt(sourceZoneIndex)];
        const targetZone = newZones[parseInt(overZoneId)];

        sourceZone.teams = sourceZone.teams.filter((t) => t !== team);
        targetZone.teams.push(team);

        return newZones;
      });
    }

    setActiveId(null);
  };

  const handleShuffle = () => {
    const shuffledZones = [...zones].map((zone) => ({
      ...zone,
      teams: [...zone.teams].sort(() => Math.random() - 0.5),
    }));
    setZones(shuffledZones);
  };

  const handleUpdateZones = () => {
    console.log('Zones updated:', zones);
  };

  return (
    <div className="text-white p-4 mb-2 font-sans relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => setActiveId(event.active.id.toString())}
      >
        <div className="flex flex-col gap-8"> {/* Changed to grid-cols-2 for 2 columns */}
          {/*{zones.map((zone, zoneIndex) => (*/}
          {/*  <SortableZone key={zoneIndex} zone={zone} zoneIndex={zoneIndex} />*/}
          {/*))}*/}
          <div className={"flex gap-8 w-full h-1/2"}>
            <SortableZone key={0} zone={zones[0]} zoneIndex={0} />
            <SortableZone key={1} zone={zones[1]} zoneIndex={1} />
          </div>
          <div className={"flex gap-8 w-full h-1/2"}>
            <SortableZone key={2} zone={zones[2]} zoneIndex={2}/>
            <SortableZone key={3} zone={zones[3]} zoneIndex={3}/>
          </div>
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="bg-red-900/20 p-4 rounded-md border border-red-500 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="font-medium tracking-wide">
                  {activeId.split('-')[0]}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default ZonesDisplay;