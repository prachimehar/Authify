import Menubar from "../components/Menubar";
import Header from "../components/Header";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Home = () => {
   const { getUserData } = useContext(AppContext);

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className="flex flex-col min-vh-100 items-center justify-center">
      <Menubar />
      <Header />
    </div>
  );
};

export default Home;
