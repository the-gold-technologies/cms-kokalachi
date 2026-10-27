"use client";

import React from "react";
import { LegalDocumentEditor } from "@/components/LegalDocumentEditor";

export default function PrivacyPolicyCMSPage() {
  return (
    <LegalDocumentEditor
      pageTitle="Privacy Policy Sections"
      pageDescription="Manage personal data collection practices, user rights, cookies, security policies, and plain-language clauses."
      apiEndpoint="/api/privacy-policy"
      documentName="Privacy Policy"
      bodyLabel="PRIVACY POLICY BODY CONTENT"
    />
  );
}
