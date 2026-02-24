import { Card, Grid, Text, Box } from "@chakra-ui/react";
import { SortMode } from "@/types/timeline";

interface SortModeToggleProps {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

const modes: { value: SortMode; label: string; description: string }[] = [
  { value: "time", label: "時間順ソート", description: "時刻を基準に自動整列" },
  {
    value: "manual",
    label: "手動並び替え",
    description: "上下ボタンで順番を制御",
  },
];

export default function SortModeToggle({
  value,
  onChange,
}: SortModeToggleProps) {
  return (
    <Card.Root variant="subtle">
      {/* Card.Body の余白を詰める */}
      <Card.Body p={3}>
        <Text fontSize="xs" letterSpacing="0.2em" color="gray.500">
          並び順モード
        </Text>

        {/* gap/mt を小さく */}
        <Grid
          gap={2}
          mt={2}
          templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}
        >
          {modes.map((mode) => {
            const active = value === mode.value;

            return (
              <Card.Root
                key={mode.value}
                variant={active ? "outline" : "elevated"}
                borderColor={active ? "blue.300" : "blackAlpha.100"}
                bg={active ? "blue.50" : "white"}
                cursor="pointer"
                onClick={() => onChange(mode.value)}
                transition="all 0.15s ease"
                _hover={{
                  borderColor: "blue.200",
                  boxShadow: "0 10px 25px rgba(244, 114, 182, 0.12)",
                }}
              >
                {/* カード側も余白削る */}
                <Card.Body p={3}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.800"
                    lineHeight="1.2"
                  >
                    {mode.label}
                  </Text>

                  {/* description を1行で省スペース */}
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mt={1}
                    lineHeight="1.2"
                    lineClamp={1}
                  >
                    {mode.description}
                  </Text>
                </Card.Body>
              </Card.Root>
            );
          })}
        </Grid>
      </Card.Body>
    </Card.Root>
  );
}
