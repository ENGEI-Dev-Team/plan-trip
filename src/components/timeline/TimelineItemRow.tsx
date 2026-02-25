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

type CategoryOption = {
  value: TimelineCategory;
  label: string;
  badgeClass?: string; // 既存に合わせて残す（使わないなら削除OK）
};

type Props = {
  item: TimelineItem;
  sortMode: SortMode;
  categoryOptions: CategoryOption[];
  isFirst: boolean;
  isLast: boolean;
  onChange: (id: string, patch: Partial<TimelineItem>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
};

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
    [categoryOptions, item.category],
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
      {/* time label (>=880px) */}
      <Text
        position="absolute"
        left={0}
        top="16px"
        w="64px"
        textAlign="right"
        pr={3}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace"
        color="#6b7280"
        fontWeight="600"
        display={isWide ? "block" : "none"}
      >
        {item.time || "--:--"}
      </Text>

      {/* dot (>=880px) */}
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
          {/* emoji icon */}
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
            {categoryEmoji(item.category)}
          </Box>

          {/* main content */}
          <Box flex={1} minW={0}>
            {/* title */}
            <Input
              value={item.title}
              placeholder="スポット / 行き先など"
              onChange={(e) =>
                onChange(item.id, { title: e.currentTarget.value })
              }
              fontSize="lg"
              fontWeight="700"
              color="#1f2937"
              _placeholder={{ color: "#9ca3af" }}
              bg="transparent"
              border="none"
              boxShadow="none"
              px={0}
              h="auto"
              _focusVisible={{ boxShadow: "none" }}
            />

            {/* memo */}
            <Textarea
              value={item.memo}
              placeholder="補足・移動手段・リンクなど"
              onChange={(e) =>
                onChange(item.id, { memo: e.currentTarget.value })
              }
              mt={2}
              rows={2}
              color="#6b7280"
              fontSize="md"
              _placeholder={{ color: "#9ca3af" }}
              bg="transparent"
              border="none"
              boxShadow="none"
              px={0}
              resize="none"
              _focusVisible={{ boxShadow: "none" }}
            />

            {/* photo url input */}
            <Input
              mt={3}
              value={item.photoUrl ?? ""}
              placeholder="写真URL（任意） https://..."
              onChange={(e) =>
                onChange(item.id, { photoUrl: e.currentTarget.value })
              }
              size="sm"
              border="1px solid #e5e7eb"
              borderRadius="10px"
              bg="white"
              color="#111827"
              _placeholder={{ color: "#9ca3af" }}
            />

            {/* preview */}
            {!!(item.photoUrl && item.photoUrl.trim()) && (
              <Box
                mt={3}
                borderRadius="16px"
                overflow="hidden"
                border="1px solid #e5e7eb"
                boxShadow="0 10px 24px rgba(0,0,0,0.06)"
                bg="#f3f4f6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photoUrl.trim()}
                  alt="写真"
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
                <Text fontSize="xs" color="#6b7280" px={3} py={2}>
                  ※表示されない場合：URLが https で公開されているか /
                  アクセス制限がないか確認してください
                </Text>
              </Box>
            )}

            {/* pills */}
            <Flex wrap="wrap" gap={3} mt={3} align="center">
              {/* category pill */}
              <Box {...pillBase}>
                <Badge colorPalette="gray" fontSize="xs">
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

              {/* amount pill */}
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
                  <Text color="#6b7280">（¥{formatAmount(item.amount)}）</Text>
                ) : null}
              </Box>

              {/* time pill */}
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
            <Flex
              mt={3}
              align="center"
              justify="space-between"
              gap={3}
              wrap="wrap"
            >
              <HStack gap={2}>
                {sortMode === "manual" && (
                  <HStack gap={2}>
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
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}_
