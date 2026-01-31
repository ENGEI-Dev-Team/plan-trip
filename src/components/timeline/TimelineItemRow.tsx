import { useState, type ChangeEvent } from "react";
import {
  Badge,
  Button,
  Card,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { SortMode, TimelineCategory, TimelineItem } from "@/types/timeline";

interface CategoryOption {
  value: TimelineCategory;
  label: string;
  badgeClass: string;
}

interface TimelineItemRowProps {
  item: TimelineItem;
  sortMode: SortMode;
  categoryOptions: CategoryOption[];
  isFirst: boolean;
  isLast: boolean;
  onChange: (id: string, patch: Partial<TimelineItem>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

const formatAmount = (value: number) =>
  value.toLocaleString("ja-JP", { maximumFractionDigits: 0 });

export default function TimelineItemRow({
  item,
  sortMode,
  categoryOptions,
  isFirst,
  isLast,
  onChange,
  onDelete,
  onMove,
}: TimelineItemRowProps) {
  const currentCategory = categoryOptions.find(
    (option) => option.value === item.category,
  );
  const [amountInput, setAmountInput] = useState(
    Number.isNaN(item.amount) ? "" : String(item.amount),
  );

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.currentTarget.value;
    setAmountInput(raw);
    if (raw === "") return;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    onChange(item.id, { amount: parsed });
  };

  const handleAmountBlur = () => {
    if (amountInput === "") {
      setAmountInput("0");
      onChange(item.id, { amount: 0 });
      return;
    }
    const parsed = Number(amountInput);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(0, parsed);
    setAmountInput(String(clamped));
    onChange(item.id, { amount: clamped });
  };

  return (
    <Card.Root variant="subtle" borderColor="blackAlpha.100">
      <Card.Body as={Stack} spacing={4}>
        <Stack direction={{ base: "column", lg: "row" }} spacing={4} align="flex-end">
          <Stack w={{ base: "100%", lg: "32" }}>
            <Text fontSize="sm" color="gray.600">
              時間
            </Text>
            <Input
              type="time"
              value={item.time}
              onChange={(event) =>
                onChange(item.id, { time: event.currentTarget.value })
              }
            />
          </Stack>

          <Stack w={{ base: "100%", lg: "48" }}>
            <Text fontSize="sm" color="gray.600">
              カテゴリ
            </Text>
            <HStack
              spacing={3}
              border="1px solid"
              borderColor="blackAlpha.200"
              borderRadius="lg"
              px={3}
              py={2}
            >
              <Badge colorPalette="gray" fontSize="xs">
                {currentCategory?.label ?? "カテゴリ"}
              </Badge>
              <NativeSelect.Root flex="1">
                <NativeSelect.Field
                  value={item.category}
                  onChange={(event) =>
                    onChange(item.id, {
                      category: event.currentTarget.value as TimelineCategory,
                    })
                  }
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </HStack>
          </Stack>

          <Stack flex="1">
            <Text fontSize="sm" color="gray.600">
              タイトル
            </Text>
            <Input
              value={item.title}
              placeholder="スポット / 行き先など"
              onChange={(event) =>
                onChange(item.id, { title: event.currentTarget.value })
              }
            />
          </Stack>
        </Stack>

        <Stack gap={3} direction={{ base: "column", lg: "row" }}>
          <Stack flex="2">
            <Text fontSize="sm" color="gray.600">
              メモ
            </Text>
            <Textarea
              rows={2}
              value={item.memo}
              placeholder="補足・移動手段・リンクなど"
              onChange={(event) =>
                onChange(item.id, { memo: event.currentTarget.value })
              }
            />
          </Stack>

          <Stack flex="1">
            <Text fontSize="sm" color="gray.600">
              金額
            </Text>
            <HStack
              border="1px solid"
              borderColor="blackAlpha.200"
              borderRadius="lg"
              px={3}
              py={2}
              spacing={2}
            >
              <Text color="gray.500">¥</Text>
              <Input
                type="number"
                min={0}
                value={amountInput}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                textAlign="right"
              />
            </HStack>
            {item.amount > 0 && (
              <Text mt={1} fontSize="xs" color="gray.500">
                ¥{formatAmount(item.amount)}
              </Text>
            )}
          </Stack>
        </Stack>

        <Flex
          wrap="wrap"
          align="center"
          justify="space-between"
          gap={3}
          color="gray.500"
          fontSize="sm"
        >
          <HStack spacing={3} align="center">
            <Text>ID: {item.id.slice(0, 6)}</Text>
            {sortMode === "manual" && (
              <HStack spacing={2}>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => onMove(item.id, "up")}
                  disabled={isFirst}
                >
                  ↑
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => onMove(item.id, "down")}
                  disabled={isLast}
                >
                  ↓
                </Button>
              </HStack>
            )}
          </HStack>

          <Button
            size="sm"
            variant="outline"
            colorPalette="red"
            onClick={() => onDelete(item.id)}
          >
            削除
          </Button>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
