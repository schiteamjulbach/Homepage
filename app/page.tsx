import Home from "@/components/public-site";
import { getPublicPlatform } from "@/lib/public-platform";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <Home initialData={await getPublicPlatform()} />;
}
