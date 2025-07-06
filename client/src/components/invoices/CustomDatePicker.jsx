import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const CustomDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  label,
  icon: Icon = Calendar,
  disabled = false,
  error = false,
  helperText = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatDisplayValue = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'MMM dd, yyyy');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div
        ref={inputRef}
        onClick={handleInputClick}
        className={`
          relative w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
          transition-all duration-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-100'}
          ${error ? 'border-red-400 bg-red-50' : ''}
          ${isOpen ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1 rounded-lg ${error ? 'text-red-500' : 'text-gray-500'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${error ? 'text-red-700' : 'text-gray-700'}`}>
              {formatDisplayValue() || placeholder}
            </div>
            {label && (
              <div className="text-xs text-gray-500 mt-0.5">
                {label}
              </div>
            )}
          </div>
          <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <div className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </div>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className={`
                        w-full h-full text-sm font-medium rounded-lg transition-all duration-200
                        ${isSelected(date) 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : isToday(date)
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 p-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDate(null);
                onChange(null);
                setIsOpen(false);
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;