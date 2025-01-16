import { FC } from "react";
import { FaRegBell } from "react-icons/fa";

const TopNav: FC = () => {
  return (
    <div className="h-[20px]  text-white flex items-center justify-between px-[40px] pt-[50px] ">
      <div className="text-lg font-semibold">Dashboard</div>
      <div>
        <div className=" text-black">
          <FaRegBell size={27} />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
