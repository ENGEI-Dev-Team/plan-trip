import { Box, Text } from "@chakra-ui/react";
import type { TimelineCategory } from "@/types/timeline";
import TimelineSummary from "./TimelineSummary";

type BudgetSummaryCardProps = {
  categoryTotals: Record<TimelineCategory, number>;
  totalAmount: number;
  perPersonAmount: number;
  peopleCount: number;
  onPeopleChange: (value: number) => void;
  categoryMeta: Record<
    TimelineCategory,
    { label: string; accentClass: string }
  >;
};

export default function BudgetSummaryCard({
  categoryTotals,
  totalAmount,
  perPersonAmount,
  peopleCount,
  onPeopleChange,
  categoryMeta,
}: BudgetSummaryCardProps) {
  return (
    <Box
      bg="white"
      border="1px solid #f1f1f0"
      borderRadius="14px"
      p={4}
      boxShadow="0 8px 20px rgba(0,0,0,0.04)"
    >
      <Text fontWeight="700" fontSize="sm" mb={2} color="#111827">
        予算
      </Text>
      <TimelineSummary
        categoryTotals={categoryTotals}
        totalAmount={totalAmount}
        perPersonAmount={perPersonAmount}
        peopleCount={peopleCount}
        onPeopleChange={onPeopleChange}
        categoryMeta={categoryMeta}
      />
    </Box>
  );
}
