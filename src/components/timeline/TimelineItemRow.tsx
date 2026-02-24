"use client";

import { Box, Button, Flex, Input, Textarea } from "@chakra-ui/react";
import type { SortMode, TimelineCategory, TimelineItem } from "@/types/timeline";

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
}: Props) {
  return (
    <Box
      bg="white"
      border="1px solid #f1f1f0"
      borderRadius="16px"
      p={4}
      boxShadow="0 8px 20px rgba(0,0,0,0.04)"
    >
      <Flex gap={2} align="center" mb={3}>

        <Input
          value={item.title}
          placeholder="スポット / 行き先など"
          onChange={(e) => onChange(item.id, { title: e.currentTarget.value })}
          flex={1}
          bg="transparent"
        />
      </Flex>

      <Textarea
        value={item.memo}
        placeholder="メモ"
        onChange={(e) => onChange(item.id, { memo: e.currentTarget.value })}
        bg="transparent"
        mb={3}
      />

      <Flex gap={2} align="center">
        <Input
          value={String(item.amount ?? 0)}
          placeholder="0"
          onChange={(e) =>
            onChange(item.id, { amount: Number(e.currentTarget.value || 0) })
          }
          w="120px"
          bg="transparent"
        />

        <Input
          value={item.photoUrl ?? ""}
          placeholder="写真URL（任意）"
          onChange={(e) => onChange(item.id, { photoUrl: e.currentTarget.value })}
          flex={1}
          bg="transparent"
        />

        {sortMode === "manual" && (
          <Flex gap={1}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMove(item.id, "up")}
              disabled={isFirst}
            >
              ↑
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMove(item.id, "down")}
              disabled={isLast}
            >
              ↓
            </Button>
          </Flex>
        )}

        <Button
          size="sm"
          variant="outline"
          borderColor="#fecaca"
          color="#ef4444"
          onClick={() => onDelete(item.id)}
        >
          削除
        </Button>
      </Flex>

      {/* プレビュー（任意） */}
      {item.photoUrl ? (
        <Box mt={3}>
          <Box fontSize="xs" color="#6b7280" mb={1}>
            プレビュー
          </Box>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.photoUrl}
            alt=""
            style={{
              width: "100%",
              borderRadius: 12,
              maxHeight: 220,
              objectFit: "cover",
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
}
