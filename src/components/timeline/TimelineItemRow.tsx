"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  NativeSelect,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { SortMode, TimelineCategory, TimelineItem } from "@/types/timeline";
import { categoryOptions } from "@/lib/category-options";
import { PRIMARY } from "@/lib/constants";
import { categoryEmoji } from "@/lib/category-emoji";
import { formatAmount } from "@/lib/format"; // ✅ 追加

/* ===============================
   型定義
=============================== */

type CategoryOption = {
  value: TimelineCategory;
  label: string;
  badgeClass?: string;
};

export type TimelineItemRowProps = {
  item: TimelineItem;
  sortMode: SortMode;
  isFirst: boolean;
  isLast: boolean;
  onChange: (id: string, patch: Partial<TimelineItem>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
};

/* ===============================
   Component
=============================== */

export default function TimelineItemRow({
  item,
  sortMode,
  isFirst,
  isLast,
  onChange,
  onDelete,
  onMove,
}: TimelineItemRowProps) {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 880px)");
    const update = () => setIsWide(mq.matches);

    update();
    mq.addEventListener?.("change", update);

    return () => {
      mq.removeEventListener?.("change", update);
    };
  }, []);

  const currentCategory = useMemo(
    () => categoryOptions.find((o) => o.value === item.category),
    [item.category],
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

  const pillBase = {
    px: 3,
    py: 1,
    borderRadius: "10px",
    bg: "#f3f4f6",
    border: "1px solid #e5e7eb",
    display: "inline-flex",
    alignItems: "center",
    gap: 2,
    fontWeight: 600,
    color: "#6b7280",
    fontSize: "sm",
  } as const;

  const pillInputBase = {
    h: "28px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    bg: "white",
    px: 2,
    fontWeight: 600,
    color: "#111827",
  } as const;

  return (
    <Box
      bg="white"
      border="1px solid #f1f1f0"
      borderRadius="16px"
      p={4}
      boxShadow="0 8px 20px rgba(0,0,0,0.04)"
      position="relative"
    >
      {/* time label */}
      <Text
        position="absolute"
        left={0}
        top="16px"
        w="64px"
        textAlign="right"
        pr={3}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        color="#6b7280"
        fontWeight="600"
        display={isWide ? "block" : "none"}
      >
        {item.time || "--:--"}
      </Text>

      {/* dot */}
      <Box
        position="absolute"
        left="70px"
        top="24px"
        w="12px"
        h="12px"
        borderRadius="full"
        bg={PRIMARY}
        border="3px solid #fff"
        boxShadow="0 0 0 2px #e5e7eb"
        display={isWide ? "block" : "none"}
      />

      {/* card */}
      <Box
        bg="white"
        border="1px solid #f1f1f0"
        borderRadius="16px"
        p={4}
        boxShadow="0 12px 34px rgba(0,0,0,0.04)"
      >
        <Flex gap={3} align="flex-start">
          {/* emoji */}
          <Box
            w="40px"
            h="40px"
            borderRadius="12px"
            bg="#f3f4f6"
            display="grid"
            placeItems="center"
            fontSize="18px"
            color="#0f172a"
            flexShrink={0}
          >
            {/* ✅ 修正ポイント */}
            {categoryEmoji[item.category ?? "other"]}
          </Box>

          {/* main */}
          <Box flex={1} minW={0}>
            <Input
              value={item.title}
              placeholder="スポット / 行き先など"
              onChange={(e) =>
                onChange(item.id, { title: e.currentTarget.value })
              }
              fontSize="lg"
              fontWeight="700"
              bg="transparent"
              border="none"
              px={0}
            />

            <Textarea
              value={item.memo}
              placeholder="補足・移動手段・リンクなど"
              onChange={(e) =>
                onChange(item.id, { memo: e.currentTarget.value })
              }
              mt={2}
              rows={2}
              bg="transparent"
              border="none"
              px={0}
              resize="none"
            />

            {/* pills */}
            <Flex wrap="wrap" gap={3} mt={3} align="center">
              {/* category */}
              <Box {...pillBase}>
                <Badge fontSize="xs">
                  {currentCategory?.label ?? "カテゴリ"}
                </Badge>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={item.category}
                    onChange={(e) =>
                      onChange(item.id, {
                        category: e.currentTarget.value as TimelineCategory,
                      })
                    }
                    style={{ height: 28 }}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              {/* amount */}
              <Box {...pillBase}>
                <Text color="#6b7280">¥</Text>
                <Input
                  type="number"
                  min={0}
                  value={amountInput}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  textAlign="right"
                  {...pillInputBase}
                />
                {item.amount > 0 ? (
                  <Text color="#6b7280">
                    （{formatAmount(item.amount)}）
                  </Text>
                ) : null}
              </Box>

              {/* time */}
              <Box {...pillBase}>
                <Text>🕒</Text>
                <Input
                  type="time"
                  value={item.time}
                  onChange={(e) =>
                    onChange(item.id, { time: e.currentTarget.value })
                  }
                  {...pillInputBase}
                />
              </Box>
            </Flex>

            {/* actions */}
            <Flex mt={3} align="center" justify="space-between">
              <HStack gap={2}>
                {sortMode === "manual" && (
                  <>
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
                  </>
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
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}