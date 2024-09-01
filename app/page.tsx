'use server';
import FooterLayout from "./components/footerLayouts/FooterLayout";
import HeaderWithNav from "./components/header/HeaderWithNav";
import 'animate.css';
import ClientSideWrapper from "@/components/ClientSideWrapper";
import SearchResults from "./SearchResults";


const Home = ({ searchParams }: {
  searchParams?: {
    search?: string;
  }
}) => {
  const search = searchParams?.search || "";

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