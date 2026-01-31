import { Button, HStack, Text } from "@chakra-ui/react";

interface PeopleCounterProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PeopleCounter({ value, onChange }: PeopleCounterProps) {
  const decrement = () => onChange(Math.max(1, value - 1));
  const increment = () => onChange(value + 1);

  return (
    <HStack spacing={3} align="center">
      <Button
        aria-label="人数を減らす"
        variant="outline"
        colorPalette="gray"
        size="sm"
        onClick={decrement}
      >
        -
      </Button>
      <Text minW="5rem" textAlign="center" fontSize="lg" fontWeight="semibold">
        {value} 人
      </Text>
      <Button
        aria-label="人数を増やす"
        variant="outline"
        colorPalette="gray"
        size="sm"
        onClick={increment}
      >
        +
      </Button>
    </HStack>
  );
}
