import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WheelRollerProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  itemHeight?: number;
}

export function WheelRoller({
  value,
  options,
  onChange,
  formatLabel,
  itemHeight = 40,
}: WheelRollerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;
  const currentIndex = options.indexOf(value);
  const currentOffset = -currentIndex * itemHeight;

  useEffect(() => {
    if (!isDragging) {
      controls.start({ 
        y: currentOffset,
        transition: { 
          type: "spring", 
          stiffness: 300, // Reduced stiffness for smoother movement
          damping: 30,
          mass: 0.8
        }
      });
    }
  }, [currentOffset, isDragging, controls]);

  const handleDragStart = (event: TouchEvent | MouseEvent) => {
    event.preventDefault(); // Prevent page scroll
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Adjust sensitivity for more precise control
    let targetIndex = Math.round((-currentOffset - offset) / itemHeight);

    // Add momentum effect with reduced sensitivity
    if (Math.abs(velocity) > 300) {
      targetIndex += Math.sign(velocity) * Math.floor(Math.abs(velocity) / 1500);
    }

    // Clamp target index
    targetIndex = Math.max(0, Math.min(options.length - 1, targetIndex));

    onChange(options[targetIndex]);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg touch-none"
      style={{
        height: containerHeight,
        perspective: "1000px",
      }}
      onTouchMove={(e) => e.preventDefault()} // Prevent page scroll on touch devices
    >
      {/* Gradiente superior e inferior */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0.95) 100%)",
        }}
      />

      {/* Línea de selección central con mayor contraste */}
      <div
        className="absolute left-0 right-0 border-t-2 border-b-2 border-blue-300/70 z-20"
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
        dragElastic={0.05} // Reduced elasticity for more precise control
        dragMomentum={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          y: currentOffset,
          touchAction: "none", // Prevent touch scrolling
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        {options.map((option, index) => {
          const isSelected = option === value;
          const offset = index * itemHeight;
          const distanceFromCenter = Math.abs(currentIndex - index);
          const scale = isSelected ? 1.1 : 1 - (distanceFromCenter * 0.1);

          return (
            <div
              key={option}
              className={`absolute left-0 right-0 flex items-center justify-center transition-all duration-200 select-none ${
                isSelected ? "text-blue-600 font-medium" : "text-gray-600"
              }`}
              style={{
                height: itemHeight,
                top: offset,
                transform: `translateZ(0) translateY(${containerHeight / 2 - itemHeight / 2}px) scale(${scale})`,
                opacity: Math.max(0, 1 - (distanceFromCenter * 0.3)),
              }}
            >
              {formatLabel ? formatLabel(option) : option}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

interface DateRollerProps {
  value: Date;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
}

export function DateRoller({
  value,
  onChange,
  minYear = 1900,
  maxYear = 2025,
}: DateRollerProps) {
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
        <WheelRoller
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
        <WheelRoller
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
        <WheelRoller
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