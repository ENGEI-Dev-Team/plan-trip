"use client";

import React from "react";
import {
  Card,
  Heading,
  Stack,
  Input,
  Button,
  HStack,
  Field,
  NativeSelect,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { tripCreateSchema, TripCreateSchema } from "@/lib/validation/trip";
import type { TripCreateInput } from "@/types/trip";
import { useCreateTrip } from "@/hooks/useCreateTrip";

// 必要に応じて外出ししてもOK
const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  // ... 省略、あとで全部埋める
  "東京都",
  "神奈川県",
  "大阪府",
  "福岡県",
];

export const CreateTripCard: React.FC = () => {
  const router = useRouter();
  const createTripMutation = useCreateTrip();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TripCreateSchema>({
    resolver: zodResolver(tripCreateSchema),
    defaultValues: {
      title: "",
      prefecture: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (values: TripCreateSchema) => {
    const payload: TripCreateInput = {
      title: values.title,
      prefecture: values.prefecture,
      startDate: values.startDate,
      endDate: values.endDate,
    };

    try {
      const result = await createTripMutation.mutateAsync(payload);
      router.push(`/edit/${result.id}`);
    } catch (error) {
      console.error(error);
      alert("旅行プランの作成に失敗しました。時間をおいて再度お試しください。");
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Card.Root variant="outline" w="full">
      <Card.Header pb={2}>
        <Heading as="h2" size="md">
          新しい旅行プランを作成
        </Heading>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            {/* タイトル */}
            <Field.Root invalid={!!errors.title}>
              <Field.Label>タイトル</Field.Label>
              <Input
                placeholder="例：春の京都2泊3日さくら巡り"
                {...register("title")}
              />
              <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
            </Field.Root>

            {/* 都道府県 */}
            <Field.Root invalid={!!errors.prefecture}>
              <Field.Label>都道府県</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field {...register("prefecture")}>
                  <option value="">都道府県を選択</option>
                  {PREFECTURES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{errors.prefecture?.message}</Field.ErrorText>
            </Field.Root>

            {/* 日付 */}
            <HStack gap={4}>
              <Field.Root invalid={!!errors.startDate} flex="1">
                <Field.Label>開始日</Field.Label>
                <Input type="date" {...register("startDate")} />
                <Field.ErrorText>
                  {errors.startDate?.message}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.endDate} flex="1">
                <Field.Label>終了日</Field.Label>
                <Input type="date" {...register("endDate")} />
                <Field.ErrorText>
                  {errors.endDate?.message}
                </Field.ErrorText>
              </Field.Root>
            </HStack>

            {/* ボタン */}
            <HStack justify="flex-end" pt={2}>
              <Button variant="ghost" onClick={handleReset} type="button">
                クリア
              </Button>
              <Button
                colorPalette="teal"
                type="submit"
                loading={isSubmitting || createTripMutation.isPending}
              >
                作成
              </Button>
            </HStack>
          </Stack>
        </form>
      </Card.Body>
    </Card.Root>
  );
};
