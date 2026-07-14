// PublicLayout.tsx

import { Outlet } from "react-router-dom";
import Wrapper from "../Wrapper";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Wrapper>
        <Outlet />
      </Wrapper>
      <Footer />
    </>
  );
};

export default PublicLayout;