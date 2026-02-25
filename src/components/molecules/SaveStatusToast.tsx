import { Box } from "@chakra-ui/react";

type SaveStatusToastProps = {
  visible: boolean;
  type: "success" | "error";
};

export function SaveStatusToast({ visible, type }: SaveStatusToastProps) {
  const isSuccess = type === "success";

  return (
    <Box
      position="fixed"
      top="20px"
      left="20px"
      zIndex={50}
      bg={isSuccess ? "#dcfce7" : "#fee2e2"}
      color={isSuccess ? "#166534" : "#991b1b"}
      border="1px solid"
      borderColor={isSuccess ? "#86efac" : "#fca5a5"}
      px={4}
      py={3}
      borderRadius="12px"
      boxShadow="0 12px 30px rgba(0,0,0,0.12)"
      transform={visible ? "translateX(0)" : "translateX(-120%)"}
      opacity={visible ? 1 : 0}
      transition="transform 0.35s ease, opacity 0.35s ease"
      pointerEvents="none"
      aria-live="polite"
    >
      {isSuccess ? "保存に成功しました" : "保存できませんでした"}
    </Box>
  );
}
