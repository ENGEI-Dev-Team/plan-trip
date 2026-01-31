import { Card, Grid, Text } from "@chakra-ui/react";
import { SortMode } from "@/types/timeline";

interface SortModeToggleProps {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

const modes: { value: SortMode; label: string; description: string }[] = [
  { value: "time", label: "時間順ソート", description: "時刻を基準に自動整列" },
  { value: "manual", label: "手動並び替え", description: "上下ボタンで順番を制御" },
];

export default function SortModeToggle({ value, onChange }: SortModeToggleProps) {
  return (
    <Card.Root variant="subtle">
      <Card.Body>
        <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.3em" color="gray.400">
          並び順モード
        </Text>
        <Grid gap={3} mt={3} templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}>
          {modes.map((mode) => {
            const active = value === mode.value;
            return (
              <Card.Root
                key={mode.value}
                variant={active ? "outline" : "elevated"}
                borderColor={active ? "pink.300" : "blackAlpha.100"}
                bg={active ? "pink.50" : "white"}
                cursor="pointer"
                onClick={() => onChange(mode.value)}
                transition="all 0.15s ease"
                _hover={{
                  borderColor: "pink.200",
                  boxShadow: "0 10px 25px rgba(244, 114, 182, 0.15)",
                }}
              >
                <Card.Body>
                  <Text fontWeight="semibold" color="gray.800">
                    {mode.label}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
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
