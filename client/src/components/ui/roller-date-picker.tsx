import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RollerPickerProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  itemHeight?: number;
}

const RollerPicker = ({
  value,
  options,
  onChange,
  formatLabel,
  itemHeight = 40,
}: RollerPickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;
  const currentIndex = options.indexOf(value);
  const currentOffset = -currentIndex * itemHeight;

  useEffect(() => {
    if (!isDragging) {
      controls.start({ 
        y: currentOffset,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  }, [currentOffset, isDragging, controls]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    
    let targetIndex = Math.round((-currentOffset - offset) / itemHeight);
    
    // Add momentum effect based on velocity
    if (Math.abs(velocity) > 500) {
      targetIndex += Math.sign(velocity) * Math.floor(Math.abs(velocity) / 1000);
    }
    
    // Clamp target index
    targetIndex = Math.max(0, Math.min(options.length - 1, targetIndex));
    
    onChange(options[targetIndex]);
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-white"
      style={{
        height: containerHeight,
        perspective: "1000px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.9) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute left-0 right-0 border-t border-b border-blue-200"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          height: itemHeight,
        }}
      />
      <motion.div
        drag="y"
        dragConstraints={{
          top: -((options.length - 1) * itemHeight),
          bottom: 0,
        }}
        dragElastic={0.1}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          y: currentOffset,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        {options.map((option, index) => {
          const isSelected = option === value;
          const offset = index * itemHeight;
          
          return (
            <div
              key={option}
              className={`absolute left-0 right-0 flex items-center justify-center transition-all duration-200 ${
                isSelected ? "text-blue-600 font-medium scale-110" : "text-gray-600"
              }`}
              style={{
                height: itemHeight,
                top: offset,
                transform: `translateZ(0) translateY(${containerHeight / 2 - itemHeight / 2}px)`,
              }}
            >
              {formatLabel ? formatLabel(option) : option}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

interface RollerDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
}

export function RollerDatePicker({
  value,
  onChange,
  minYear = 1900,
  maxYear = 2025,
}: RollerDatePickerProps) {
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const formatMonth = (month: number) => 
    format(new Date(2000, month, 1), "MMMM", { locale: es });

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">Día</div>
        <RollerPicker
          value={value.getDate()}
          options={days}
          onChange={(day) => {
            const newDate = new Date(value);
            newDate.setDate(day);
            onChange(newDate);
          }}
        />
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">Mes</div>
        <RollerPicker
          value={value.getMonth()}
          options={months}
          formatLabel={formatMonth}
          onChange={(month) => {
            const newDate = new Date(value);
            newDate.setMonth(month);
            onChange(newDate);
          }}
        />
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">Año</div>
        <RollerPicker
          value={value.getFullYear()}
          options={years}
          onChange={(year) => {
            const newDate = new Date(value);
            newDate.setFullYear(year);
            onChange(newDate);
          }}
        />
      </div>
    </div>
  );
}
