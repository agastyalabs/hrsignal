"use client";

import { Suspense } from "react";
import RecommendInner from "@/components/recommend/RecommendInner";

export default function RecommendClient() {
  return (
    <Suspense>
      <RecommendInner mode="recommend" />
    </Suspense>
  );
}
