"use client"
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
import zonesData from "@/app/data/Leaderboard.json";

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
            <img src='/level.png' alt='levelup' className='w-5 h-5'></img>
          <span className="tracking-wide font-serif font-extrabold">{team}</span>
        </div>
        <div onClick={(e) => e.stopPropagation()} className='font-dseg7'>
          <TeamDetails team={team} details={teamDetails} className="" />
        </div>
      </div>
    </li>
  );
};

const SortableZone = ({ zone, zoneIndex }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(zone.endTime);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [zone.endTime]);

  return (
    <div className='bg-red-900 rounded-lg'>
    <div className=" bg-black opacity-85 backdrop-blur-sm p-5 rounded-lg border border-red-500/30 hover:border-red-500 transition-all duration-300 shadow-lg relative group">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className=" ">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold tracking-tight font-serif ">{zone.name}</h2>
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
            ))}
          </ul>
        </SortableContext>
      </div>
    </div></div>
  );
};

const ZonesDisplay = () => {
  const [zones, setZones] = useState(zonesData);
  const [activeId, setActiveId] = useState(null);

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
    <div className=" text-white p-4 mb-2 font-sans relative overflow-hidden">
      <div className="absolute inset-0  opacity-5 pointer-events-none" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => setActiveId(event.active.id.toString())}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {zones.map((zone, zoneIndex) => (
            <SortableZone key={zoneIndex} zone={zone} zoneIndex={zoneIndex} />
          ))}
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