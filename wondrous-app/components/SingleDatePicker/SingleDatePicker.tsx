import { useMemo, useState, useEffect } from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import moment from 'moment';
import { isEmpty } from 'lodash';
import Image from 'next/image';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import {
  DATEPICKER_OPTIONS,
  DEFAULT_SINGLE_DATEPICKER_VALUE,
  WEEK_DAYS,
  DAY_STRING_MONTH_SHORT_YEAR,
  MONTH_DAY_FULL_YEAR,
} from 'utils/constants';

import DatePickerRecurringUtilities from 'components/DatePickerRecurringUtilities';
import DatePickerNavButton from 'components/DatePickerNavButton';
import CalendarDay from 'components/CalendarDay';

import styles from './SingleDatePickerStyles';
import { Popper } from '@mui/material';
import CloseModalIcon from 'components/Icons/closeModal';

interface SingleDatePickerProps {
  sx?: object;
  setValue?: Function;
  setRecurrenceType?: Function;
  setRecurrenceValue?: Function;
  recurrenceType?: any;
  recurrenceValue?: any;
  value?: any;
  hideRecurring?: boolean;
  className?: string;
  handleClose?(): void;
}

const SingleDatePicker = ({
  sx,
  setValue,
  value,
  setRecurrenceType,
  recurrenceType,
  recurrenceValue,
  setRecurrenceValue,
  hideRecurring,
  className,
  handleClose,
}: SingleDatePickerProps) => {
  const [date, setDate] = useState(DEFAULT_SINGLE_DATEPICKER_VALUE);
  const [showOptions, setShowOptions] = useState(false);
  const [repeatType, setRepeatType] = useState();
  const [repeatValue, setRepeatValue] = useState();
  const [weekDaysSelected, setWeekDaysSelected] = useState<Object>(WEEK_DAYS);
  const [monthInView, setMonthInView] = useState();

  const parseWeekDaysToPosition = (weekDays) => {
    const booleanDayList = Object.keys(weekDays).map((_, idx) => Object.values(weekDays)[idx]);
    const dayPositionList = booleanDayList.map((elm, idx) => elm && idx).filter((elm) => elm || elm === 0);
    return dayPositionList;
  };
  const parsePositionToWeekDays = (values) => {
    const listOfDays = Object.keys(WEEK_DAYS).map((day, idx) =>
      values.includes(idx) ? { [day]: true } : { [day]: false }
    );
    const weekDays = listOfDays.reduce((map, newValue) => ({ ...map, ...newValue }));

    return weekDays;
  };

  useEffect(() => {
    if(repeatType && !date) {
      // if there are no day selected but repeat value set, default to today
     setDate(moment());   
    }
  }, [repeatType, date]);

  useEffect(() => {
    value && setDate(moment(value));
    recurrenceType && setRepeatType(recurrenceType);

    if (recurrenceType === DATEPICKER_OPTIONS.WEEKLY) {
      const parsedWeekDays = parsePositionToWeekDays(recurrenceValue);
      setWeekDaysSelected(parsedWeekDays);
      return;
    }
    recurrenceValue && setRepeatValue(recurrenceValue);
  }, []);

  useEffect(() => {
    if (repeatType === DATEPICKER_OPTIONS.WEEKLY) {
      const parsedWeekDays = parseWeekDaysToPosition(weekDaysSelected);
      !isEmpty(parsedWeekDays) && setRecurrenceValue(parsedWeekDays);
    }
  }, [weekDaysSelected, repeatType]);

  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setValue(moment(newDate).toDate());
  };

  const handleSetRepeatType = (newType) => {
    setRepeatType(newType);
    setRecurrenceType(newType);
  };

  const handleSetRepeatValue = (newValue) => {
    setRepeatValue(newValue);
    setRecurrenceValue(newValue);
  };

  const todayMoment = moment();

  const displayValue = useMemo(() => {
    if (!date && !repeatType) return '';

    const start = date?.format(DAY_STRING_MONTH_SHORT_YEAR);

    return `${start ? `${start}` : ''}${repeatType ? ` - ${repeatType}` : ''}`;
  }, [date, repeatType]);

  const startDateString = date?.format(MONTH_DAY_FULL_YEAR) || '';

  const parsedWeekDays = Object.values(weekDaysSelected)
    .map((item, idx) => (item ? idx : null))
    .filter((item) => item || item === 0);

  const handleWeekDaysChange = (event) => {
    setWeekDaysSelected({
      ...weekDaysSelected,
      [event.target.name]: event.target.checked,
    });
  };

  const highlightDay = (day) => {
    const initialDate = date || todayMoment;
    const dayOfyear = day.dayOfYear();
    const initialDayOfYear = initialDate.dayOfYear();

    if (repeatType === DATEPICKER_OPTIONS.DAILY) {
      return day.isSameOrAfter(initialDate);
    }
    if (repeatType === DATEPICKER_OPTIONS.WEEKLY) {
      return parsedWeekDays.includes(day.weekday()) && day.isAfter(initialDayOfYear);
    }
    if (repeatType === DATEPICKER_OPTIONS.MONTHLY) {
      return day.date() === repeatValue && day.isAfter(initialDayOfYear);
    }
    if (repeatType === DATEPICKER_OPTIONS.PERIODICALLY) {
      const rest = (dayOfyear + initialDayOfYear) % Number(repeatValue);
      return rest === 0 && day.isAfter(initialDayOfYear);
    }
    return false;
  };

  const reset = () => {
    handleDateChange(DEFAULT_SINGLE_DATEPICKER_VALUE);
    handleSetRepeatType(null);
    handleSetRepeatValue(null);
    setShowOptions(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        className={className}
        mt={4}
        display="flex"
        flexDirection="column"
        maxWidth={300}
        width={open ? 300 : 'default'}
      >
        <TextField
          placeholder="Choose date"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start" sx={styles.calendarIcon}>
                <Image src="/images/icons/calendar.svg" width={12} height={12} alt="calendar icon" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAnchorEl(null);
                    handleClose?.();
                  }}
                >
                  <CloseModalIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={displayValue}
          onClick={handleClick}
          sx={open ? styles.mainTextfield : styles.mainTextfieldInactive}
        />
      </Box>
      <ClickAwayListener onClickAway={handleClickAway} mouseEvent={'onMouseDown'}>
        <Popper open={open} anchorEl={anchorEl} placement="bottom" disablePortal={true}>
          <Box sx={styles.mainContainer}>
            <Box sx={{ ...styles.root, ...sx }}>
              <Box sx={styles.inputContainer}>
                <TextField
                  value={startDateString}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={reset}>
                          <CloseModalIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  placeholder="Due Date"
                  sx={styles.darkTextfield}
                />
              </Box>
              <DayPickerSingleDateController
                date={date}
                initialDate={date}
                id="your_unique_id"
                onDateChange={(date) => handleDateChange(date)}
                focusedInput={open}
                onFocusChange={() => {}}
                numberOfMonths={1}
                displayFormat="MM/DD/yyyy"
                daySize={35.9}
                minimumNights={0}
                enableOutsideDays
                navPrev={<DatePickerNavButton prev />}
                navNext={<DatePickerNavButton next />}
                onPrevMonthClick={(month) => {
                  setMonthInView(month);
                }}
                onNextMonthClick={(month) => {
                  setMonthInView(month);
                }}
                customArrowIcon={<></>}
                isDayHighlighted={(day) => highlightDay(day)}
                isDayBlocked={(day) => day.isBefore(todayMoment)}
                renderCalendarDay={(props) => <CalendarDay {...props} />}
                hideKeyboardShortcutsPanel
                renderCalendarInfo={() =>
                  !hideRecurring && (
                    <DatePickerRecurringUtilities
                      monthInView={monthInView}
                      showOptions={showOptions}
                      setShowOptions={setShowOptions}
                      setDate={handleDateChange}
                      setRepeatType={handleSetRepeatType}
                      repeatType={repeatType}
                      setRepeatValue={handleSetRepeatValue}
                      repeatValue={repeatValue}
                      date={date}
                      todayMoment={todayMoment}
                      onWeekDaysChange={handleWeekDaysChange}
                      weekDaysSelected={weekDaysSelected}
                    />
                  )
                }
              />
            </Box>
          </Box>
        </Popper>
      </ClickAwayListener>
    </>
  );
};

export default SingleDatePicker;
