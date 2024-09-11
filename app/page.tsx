'use server';
import FooterLayout from "./components/footerLayouts/FooterLayout";
import HeaderWithNav from "./components/header/HeaderWithNav";
import 'animate.css';
import ClientSideWrapper from "@/components/ClientSideWrapper";
import { createClient } from '@/utils/supabase/server';
import SearchResults from "./SearchResults";
import { redirect } from 'next/navigation'


const Home = async ({ searchParams }: {
  searchParams?: {
    search?: string;
  }
}) => {

  const search = searchParams?.search || "";
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="transition-all">
        <HeaderWithNav />

        {/* <CategorySelector setSelectedCategory={setSelectedCategory} />
        <FoodDiv /> */}
        {search === "" && <ClientSideWrapper />}
        {search !== "" && <SearchResults search={search} />}
        {/* make contact go away when the user is an owner */}
        {/* <ContactPg className={`${userType && userType === "owner" ? "hidden" : "block"}`} /> */}
        <FooterLayout />
      </div>
    </>
  )
}

export default Home;