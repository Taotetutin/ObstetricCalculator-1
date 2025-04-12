import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar } from "lucide-react";
import { format, setDate, setMonth, setYear } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateDropdownProps {
  value: Date;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
}

export function DateDropdown({
  value,
  onChange,
  minYear = 1900,
  maxYear = 2025,
}: DateDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"day" | "month" | "year">("day");

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  ).reverse(); // Reversed to show newest years first
  
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i), "MMMM", { locale: es }),
  }));
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDayChange = (day: number) => {
    try {
      const newDate = setDate(value, day);
      onChange(newDate);
    } catch (e) {
      console.error("Invalid date", e);
    }
  };

  const handleMonthChange = (month: number) => {
    try {
      const newDate = setMonth(value, month);
      onChange(newDate);
      // If we selected a month with fewer days, auto-adjust to valid date
      if (value.getDate() > new Date(value.getFullYear(), month + 1, 0).getDate()) {
        const lastDayOfMonth = new Date(value.getFullYear(), month + 1, 0).getDate();
        onChange(setDate(newDate, lastDayOfMonth));
      }
    } catch (e) {
      console.error("Invalid date", e);
    }
  };

  const handleYearChange = (year: number) => {
    try {
      const newDate = setYear(value, year);
      onChange(newDate);
    } catch (e) {
      console.error("Invalid date", e);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-blue-200 text-left font-normal h-12"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{format(value, "PPP", { locale: es })}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-3 border-b border-gray-100">
          <div className="text-center font-medium text-sm text-blue-600 mb-2">
            {format(value, "PPP", { locale: es })}
          </div>
          <Tabs
            defaultValue="day"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "day" | "month" | "year")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="day" className="text-xs">Día</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Mes</TabsTrigger>
              <TabsTrigger value="year" className="text-xs">Año</TabsTrigger>
            </TabsList>

            <TabsContent value="day" className="h-48 overflow-y-auto">
              <div className="grid grid-cols-7 gap-1 p-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={value.getDate() === day ? "default" : "outline"}
                    className={`h-9 min-w-9 p-0 ${
                      value.getDate() === day
                        ? "bg-blue-600 text-white"
                        : "border-gray-200 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      handleDayChange(day);
                      setActiveTab("month");
                    }}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="month" className="h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-1 p-2">
                {months.map((month) => (
                  <Button
                    key={month.value}
                    variant={value.getMonth() === month.value ? "default" : "outline"}
                    className={`h-9 w-full text-xs capitalize ${
                      value.getMonth() === month.value
                        ? "bg-blue-600 text-white"
                        : "border-gray-200 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      handleMonthChange(month.value);
                      setActiveTab("year");
                    }}
                  >
                    {month.label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="year" className="h-48 overflow-y-auto">
              <div className="grid grid-cols-3 gap-1 p-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={value.getFullYear() === year ? "default" : "outline"}
                    className={`h-9 w-full ${
                      value.getFullYear() === year
                        ? "bg-blue-600 text-white"
                        : "border-gray-200 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      handleYearChange(year);
                      setOpen(false);
                    }}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}