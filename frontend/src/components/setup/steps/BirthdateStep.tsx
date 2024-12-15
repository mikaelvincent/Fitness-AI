import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BirthdateStepProps {
    birthdate: string; // ISO format date string
    onChange: (key: string, value: any) => void;
}

export const BirthdateStep: React.FC<BirthdateStepProps> = ({ birthdate, onChange }) => {

    // Handle date change
    const handleDateChange = (date: Date | null) => {

        if (date) {
            console.log(date.toISOString().split('T')[0])
            onChange("birthdate", date.toISOString().split('T')[0]); // Save as ISO string (YYYY-MM-DD)
        }
    };

    return (
        <div className="space-y-4 text-center">
            <h2 className="text-lg font-medium">Select Your Birthdate</h2>
            <div className="flex justify-center">
                <DatePicker
                    selected={birthdate ? new Date(birthdate) : null}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy" // Day, Month, and Year format
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select" // Enables dropdowns for month and year
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 13))} // Max 13 years ago
                    minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))} // Min 100 years ago
                    placeholderText="DD/MM/YYYY"
                    className="bg-inherit border rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};
