import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

interface GestationWheelRollerProps {
  value: { weeks: number; days: number };
  onChange: (value: { weeks: number; days: number }) => void;
}

export function GestationWheelRoller({ value, onChange }: GestationWheelRollerProps) {
  const [selectedWeek, setSelectedWeek] = useState(value.weeks || 20);
  const [selectedDay, setSelectedDay] = useState(value.days || 0);
  const weeksControls = useAnimation();
  const daysControls = useAnimation();

  const weeks = Array.from({ length: 21 }, (_, i) => i + 20); // 20 to 40 weeks
  const days = Array.from({ length: 7 }, (_, i) => i); // 0 to 6 days

  const ITEM_HEIGHT = 40;
  const VISIBLE_ITEMS = 5;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

  const handleWeekScroll = async (_, info: { offset: { y: number } }) => {
    const offset = info.offset.y;
    const index = Math.round(offset / ITEM_HEIGHT);
    const week = weeks[Math.abs(index) % weeks.length];
    if (week !== selectedWeek) {
      setSelectedWeek(week);
      onChange({ weeks: week, days: selectedDay });
    }
  };

  const handleDayScroll = async (_, info: { offset: { y: number } }) => {
    const offset = info.offset.y;
    const index = Math.round(offset / ITEM_HEIGHT);
    const day = days[Math.abs(index) % days.length];
    if (day !== selectedDay) {
      setSelectedDay(day);
      onChange({ weeks: selectedWeek, days: day });
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center bg-white rounded-lg p-4 border">
      <div className="relative w-20 overflow-hidden" style={{ height: CONTAINER_HEIGHT }}>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white z-10" />
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDrag={handleWeekScroll}
          className="cursor-grab active:cursor-grabbing"
          style={{ y: -(selectedWeek - weeks[0]) * ITEM_HEIGHT }}
          animate={weeksControls}
        >
          {weeks.map((week) => (
            <div
              key={week}
              className={`h-[40px] flex items-center justify-center text-lg
                ${selectedWeek === week ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
            >
              {week}
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-0 pointer-events-none border-y-2 border-blue-500 top-[80px] h-[40px]" />
      </div>

      <div className="text-lg font-medium">semanas</div>

      <div className="relative w-20 overflow-hidden" style={{ height: CONTAINER_HEIGHT }}>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white z-10" />
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDrag={handleDayScroll}
          className="cursor-grab active:cursor-grabbing"
          style={{ y: -(selectedDay - days[0]) * ITEM_HEIGHT }}
          animate={daysControls}
        >
          {days.map((day) => (
            <div
              key={day}
              className={`h-[40px] flex items-center justify-center text-lg
                ${selectedDay === day ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
            >
              {day}
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-0 pointer-events-none border-y-2 border-blue-500 top-[80px] h-[40px]" />
      </div>

      <div className="text-lg font-medium">días</div>
    </div>
  );
}
