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
  onDateChange: (name: string, newDate: Date | null) => void;
}


export default function Calendar({
  label,
  value: initialValue,
  name = "date"
}: CalendarProps) {
  const [value, setValue] = React.useState<Date | null>(initialValue ?? null);

  console.log('Incoming value to DatePicker:', dayjs(value));

  console.log('Calendar component', { label, value, name });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={label}
          value={value ? (isDayjs(value) ? value : dayjs(value)) : null}
          slotProps={{ textField: { fullWidth: true, name } }}

        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
