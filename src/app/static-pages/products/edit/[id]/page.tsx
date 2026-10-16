"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "../../components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  return <ProductForm productId={id} isNew={false} />;
}
