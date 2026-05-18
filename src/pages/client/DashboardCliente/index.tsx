
import Footer from "@layout/Footer";
import Navbar from "@layout/Navbar";
import UserCard from "./UserCard";
import MembershipSummaryCard from "./MembershipSummaryCard";

export default function Dashboard() {
  const images = {
    iconCard: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/ruvgt3n0_expires_30_days.png", // Estrella roja
    idCardImage: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/ory280oa_expires_30_days.png", // Chico pesas
    purpleCircle: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/9m4a9baw_expires_30_days.png", 
    orangeTicket: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/r149okud_expires_30_days.png", 
    logoFooter: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/xx9qbpqk_expires_30_days.png",
  };

  return (
    <div className="flex h-screen bg-[#9FDDFF] overflow-hidden font-sans">
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F6F8FE]">
        <Navbar/>
        <div className="bg-[#9FDDFF] w-full py-10 px-12">
            <h1 className="text-black text-4xl font-normal opacity-80">Menu principal de opciones</h1>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 px-10 mt-6 pb-12 items-stretch">
            <UserCard images={images} />
            <MembershipSummaryCard images={images} />
        </div>

        <Footer />
      </div>
    </div>
  );
}
