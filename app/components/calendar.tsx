import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface CalendarProps {
  label?: string;
  value?: Date | null;
  name?: string;
  onDateChange: (name: string, newDate: Date | null) => void;
}

export default function Calendar({
  label,
  value,
  name = "date",
  onDateChange
}: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={label}
          value={value ? value : null}
          onChange={(newValue) => {
            onDateChange(name, newValue ? newValue : null);
          }}
          slotProps={{ textField: { fullWidth: true, name, value } }}

        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
