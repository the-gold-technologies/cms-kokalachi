"use client";

import React from "react";
import { LegalDocumentEditor } from "@/components/LegalDocumentEditor";

export default function TermsAndConditionsCMSPage() {
  return (
    <LegalDocumentEditor
      pageTitle="Terms & Conditions Sections"
      pageDescription="Manage legal terms, booking policies, trip requirements, liability sections, and plain-language clauses."
      apiEndpoint="/api/terms"
      documentName="Terms & Conditions"
      bodyLabel="TERMS & CONDITIONS BODY CONTENT"
    />
  );
}
