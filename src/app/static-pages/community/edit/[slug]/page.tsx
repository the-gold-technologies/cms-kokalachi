import { DestinationChapterForm } from "../../components/DestinationChapterForm";

interface EditDestinationChapterProps {
  params: Promise<{ slug: string }>;
}

export default async function EditDestinationChapterPage({ params }: EditDestinationChapterProps) {
  const { slug } = await params;
  return <DestinationChapterForm initialSlug={slug} isNew={false} />;
}
