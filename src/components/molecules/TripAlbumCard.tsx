"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
  Dialog,
} from "@chakra-ui/react";

type Props = {
  photos: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
  onPhotoClick?: (url: string, index: number) => void;
};

export function TripAlbumCard({ photos, onAdd, onRemove, onPhotoClick }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const canAdd = useMemo(() => url.trim().length > 0, [url]);

  const handleAdd = () => {
    const v = url.trim();
    if (!v) return;
    onAdd(v);
    setUrl("");
    setOpen(false);
  };

  return (
    <Box
      border="1px solid #f1f1f0"
      borderRadius="14px"
      p={4}
      boxShadow="0 8px 20px rgba(0,0,0,0.04)"
      bg="white"
    >
      <Flex align="center" justify="space-between" mb={3}>
        <Text fontWeight="700" fontSize="sm" color="#111827">
          旅のアルバム
        </Text>

        <Button
          size="sm"
          borderRadius="full"
          bg="#0ea5e9"
          color="white"
          _hover={{ opacity: 0.92 }}
          onClick={() => setOpen(true)}
        >
          ＋
        </Button>
      </Flex>

      {photos.length === 0 ? (
        <Box
          border="1px dashed #e5e7eb"
          borderRadius="12px"
          p={4}
          color="#6b7280"
          fontSize="sm"
          textAlign="center"
        >
          まだ写真がありません。右上の「＋」からURLを追加できます。
        </Box>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {photos.map((src, i) => (
            <Box key={`${src}-${i}`}>
              <Box
                key={src}
                borderRadius="12px"
                overflow="hidden"
                bg="#f3f4f6"
                border="1px solid #e5e7eb"
                cursor="pointer"
                boxShadow="0 6px 16px rgba(0,0,0,0.08)"
                onClick={() => onPhotoClick?.(src, i)}
              >
                <img
                  src={src}
                  alt={`photo-${i + 1}`}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>

              {onRemove && (
                <Button
                  mt={2}
                  size="xs"
                  variant="outline"
                  width="100%"
                  onClick={() => onRemove(i)}
                >
                  削除
                </Button>
              )}
            </Box>
          ))}
        </Grid>
      )}

      {/* Chakra v3: Modalではなく Dialog */}
      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>画像を追加（URL）</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={3}>
                <Text fontSize="sm" color="#6b7280">
                  画像URL（https://...）を貼り付けてください
                </Text>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.currentTarget.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button
                bg="#0ea5e9"
                color="white"
                _hover={{ opacity: 0.92 }}
                onClick={handleAdd}
                disabled={!canAdd}
              >
                追加
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
