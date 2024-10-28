import { Link } from "react-router-dom";
import logo from "/logo_q.svg";

export const Logo = () => {
  return (
    <Link to={"/"} className="flex items-center gap-3">
      <img src={logo} width={30} />
    </Link>
  );
};
