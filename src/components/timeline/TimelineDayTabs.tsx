import { Button, HStack } from "@chakra-ui/react";

const PRIMARY = "#0ea5e9";

type TimelineDayTabsProps = {
  labels: string[];
  activeDay: number;
  onChange: (index: number) => void;
};

export default function TimelineDayTabs({
  labels,
  activeDay,
  onChange,
}: TimelineDayTabsProps) {
  return (
    <HStack
      px={4}
      py={3}
      gap={2}
      overflowX="auto"
      bg="rgba(250,250,249,0.85)"
      borderBottom="1px solid #f1f1f0"
    >
      {labels.map((label, idx) => {
        const active = idx === activeDay;
        return (
          <Button
            key={label}
            size="sm"
            borderRadius="full"
            border="1px solid"
            borderColor={active ? "transparent" : "#e5e7eb"}
            bg={active ? PRIMARY : "white"}
            color={active ? "white" : "#6b7280"}
            boxShadow={active ? "0 10px 24px rgba(14,165,233,0.26)" : "none"}
            onClick={() => onChange(idx)}
            flexShrink={0}
          >
            {label}
          </Button>
        );
      })}
    </HStack>
  );
}
