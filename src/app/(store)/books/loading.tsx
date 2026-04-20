import BrandedLoader from "@/components/store/BrandedLoader";

export default function Loading() {
  return (
    <div className="container py-8 md:py-12">
      <BrandedLoader label="Loading books…" />
    </div>
  );
}
