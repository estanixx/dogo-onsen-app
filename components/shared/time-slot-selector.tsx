import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
interface TimeSlotSelectorProps {
  selected: string | null;
  onSelect: (time: string) => void;
  availableTimeSlots: string[];
}
export default function TimeSlotSelector({
  selected,
  onSelect,
  availableTimeSlots: timeSlots,
}: TimeSlotSelectorProps) {
  return (
    <ToggleGroup type="single" className="p-4 grid grid-cols-2 gap-2">
      {timeSlots.map((time) => (
        <ToggleGroupItem
          key={time}
          value={time}
          onClick={() => onSelect(time)}
          variant="outline"
          aria-label={`Select ${time}`}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {time}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
