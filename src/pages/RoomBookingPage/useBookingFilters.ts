import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_EQUIPMENT, Equipment, formatDate } from 'pages/components/reservationDomain';

function parseEquipment(value: string): Equipment[] {
  return value.split(',').filter((item): item is Equipment => ALL_EQUIPMENT.includes(item as Equipment));
}

function getValidationError(startTime: string, endTime: string, attendees: number) {
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (!hasTimeInputs) {
    return null;
  }

  if (endTime <= startTime) {
    return '종료 시간은 시작 시간보다 늦어야 합니다.';
  }

  if (attendees < 1) {
    return '참석 인원은 1명 이상이어야 합니다.';
  }

  return null;
}

export function useBookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<Equipment[]>(
    searchParams.get('equipment') ? parseEquipment(searchParams.get('equipment') as string) : []
  );
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetSelectionState = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  const validationError = useMemo(
    () => getValidationError(startTime, endTime, attendees),
    [startTime, endTime, attendees]
  );
  const isFilterComplete = startTime !== '' && endTime !== '' && !validationError;

  const updateDate = (value: string) => {
    setDate(value);
    resetSelectionState();
  };

  const updateStartTime = (value: string) => {
    setStartTime(value);
    resetSelectionState();
  };

  const updateEndTime = (value: string) => {
    setEndTime(value);
    resetSelectionState();
  };

  const updateAttendees = (value: string) => {
    setAttendees(Math.max(1, Number(value)));
    resetSelectionState();
  };

  const updatePreferredFloor = (value: string) => {
    setPreferredFloor(value === '' ? null : Number(value));
    resetSelectionState();
  };

  const toggleEquipment = (targetEquipment: Equipment) => {
    const selected = equipment.includes(targetEquipment);
    const next = selected
      ? equipment.filter(selectedEquipment => selectedEquipment !== targetEquipment)
      : [...equipment, targetEquipment];

    setEquipment(next);
    resetSelectionState();
  };

  return {
    date,
    startTime,
    endTime,
    attendees,
    equipment,
    preferredFloor,
    selectedRoomId,
    errorMessage,
    validationError,
    isFilterComplete,
    setSelectedRoomId,
    setErrorMessage,
    updateDate,
    updateStartTime,
    updateEndTime,
    updateAttendees,
    updatePreferredFloor,
    toggleEquipment,
  };
}
