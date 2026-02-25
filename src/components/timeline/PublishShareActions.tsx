import { Box, Button, Text } from "@chakra-ui/react";

type PublishShareActionsProps = {
  isPublishing: boolean;
  shareLinkId: string | null;
  publishError: string | null;
  onPublish: () => void;
};

export default function PublishShareActions({
  isPublishing,
  shareLinkId,
  publishError,
  onPublish,
}: PublishShareActionsProps) {
  return (
    <>
      <Box mt={3}>
        <Button colorPalette="blue" onClick={onPublish} loading={isPublishing}>
          共有リンクを作成
        </Button>
      </Box>
      {shareLinkId && (
        <Text mt={2} fontSize="sm" color="#1f2937">
          /preview/{shareLinkId}
        </Text>
      )}
      {publishError && (
        <Text mt={2} fontSize="sm" color="red.500">
          {publishError}
        </Text>
      )}
    </>
  );
}
