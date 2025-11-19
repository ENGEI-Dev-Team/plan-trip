import { Stack } from "@chakra-ui/react";
import Link from "next/link";
import { PageTitle } from "../components/atoms/PageTitle";
import { BodyText } from "@/components/atoms/BodyText";
import { PrimaryButton } from "@/components/atoms/PrimaryButton";

type HeroCTAProps = {
  // どこに遷移するかは親(Page / Organism)から渡す
  createPlanHref: string;
};

export const HeroCTA = ({ createPlanHref }: HeroCTAProps) => {
  return (
    <Stack spacing={4} maxW="520px">
      <PageTitle>
        1分でつくれる、
        <br />
        あなただけの旅行しおり
      </PageTitle>

      <BodyText>
        行き先と日付を入れるだけで、旅の予定をきれいに整理できます。
        <br />
        友だちや家族ともかんたん共有。
      </BodyText>

      <Link href={createPlanHref} passHref>
        {/* Link内にボタンAtomをそのまま置く */}
        <PrimaryButton as="a" label="旅行プラン作成" />
      </Link>

      <BodyText fontSize="xs">
        入力は4つだけ（タイトル・都道府県・開始日・終了日）
      </BodyText>
    </Stack>
  );
};
