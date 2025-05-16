import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { isDayjs } from 'dayjs';
interface CalendarProps {
  label?: string;
  value?: Date | null;
  name?: string;
  onChange: (value: dayjs.Dayjs | null) => void;

}


export default function Calendar({ label, value, onChange }: CalendarProps) {



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={label}
          value={value ? (isDayjs(value) ? value : dayjs(value)) : null}
          onChange={onChange}

        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
