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
import type { ItineraryPublishArgs } from "@/types/publish";

// 必要に応じて外出ししてもOK
const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

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
      const publishArgs: ItineraryPublishArgs = {
        itinerary_id: result.id,
        title: payload.title,
        pref_code: payload.prefecture,
        start_date: payload.startDate,
        end_date: payload.endDate,
        people_count: 1,
        items: [],
      };
      console.log("[create] default publishArgs", publishArgs);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `tripbook.publish-args.v1.${result.id}`,
          JSON.stringify(publishArgs),
        );
      }
      router.push(`/edit/${result.id}`);
    } catch (error) {
      console.error(error);
      alert("旅行プランの作成に失敗しました。時間をおいて再度お試しください。");
    }
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
                <Field.ErrorText>{errors.startDate?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.endDate} flex="1">
                <Field.Label>終了日</Field.Label>
                <Input type="date" {...register("endDate")} />
                <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
              </Field.Root>
            </HStack>

            {/* ボタン */}
            <HStack justify="flex-end" pt={2}>
              <Button variant="ghost" onClick={() => reset()} type="button">
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
