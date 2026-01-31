import { Badge, Box, Card, Heading, Stack, Text } from "@chakra-ui/react";
import { TimelineCategory } from "@/types/timeline";
import PeopleCounter from "./PeopleCounter";

interface CategoryMeta {
  label: string;
  accentClass: string;
}

interface TimelineSummaryProps {
  categoryTotals: Record<TimelineCategory, number>;
  totalAmount: number;
  perPersonAmount: number;
  peopleCount: number;
  onPeopleChange: (value: number) => void;
  categoryMeta: Record<TimelineCategory, CategoryMeta>;
}

const formatCurrency = (value: number) =>
  `¥${value.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}`;

export default function TimelineSummary({
  categoryTotals,
  totalAmount,
  perPersonAmount,
  peopleCount,
  onPeopleChange,
  categoryMeta,
}: TimelineSummaryProps) {
  return (
    <Stack gap={4}>
      <Stack gap={1}>
        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.3em"
          color="gray.500"
        >
          費用サマリー
        </Text>
        <Heading size="md" color="gray.800">
          Budget
        </Heading>
        <Text fontSize="sm" color="gray.500">
          カテゴリ別の合計と 1 人あたりの目安をリアルタイムに確認できます。
        </Text>
      </Stack>

      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor="pink.200"
        bg="pink.50"
        px={4}
        py={3}
      >
        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.3em"
          color="pink.500"
        >
          Total
        </Text>
        <Text fontSize="2xl" fontWeight="semibold" color="gray.800">
          {formatCurrency(totalAmount)}
        </Text>
        <Text fontSize="sm" color="pink.500">
          1 人あたり{" "}
          <Text as="span" fontWeight="semibold">
            {formatCurrency(Math.round(perPersonAmount))}
          </Text>
        </Text>
      </Box>

      <Box
        border="1px solid"
        borderColor="blackAlpha.100"
        borderRadius="lg"
        p={4}
        bg="white"
      >
        <Text fontSize="xs" color="gray.500">
          人数
        </Text>
        <PeopleCounter value={peopleCount} onChange={onPeopleChange} />
      </Box>

      <Stack gap={2}>
        {(Object.keys(categoryMeta) as TimelineCategory[]).map((category) => (
          <Box
            key={category}
            border="1px solid"
            borderColor="blackAlpha.100"
            borderRadius="lg"
            px={4}
            py={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bg="white"
          >
            <Badge colorPalette="gray">{categoryMeta[category].label}</Badge>
            <Text fontWeight="semibold" color="gray.800">
              {formatCurrency(categoryTotals[category] ?? 0)}
            </Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
