import logo from "../assets/zemplee.png";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name = "KV" }) => {
  const orgLogo = "";
  const Profile = () => {
    return (
      <Popover>
        <PopoverButton className="block bg-[var(--pink)] rounded-full w-12 h-12 text-sm/6 font-semibold overflow-hidden text-white focus:outline-none  data-[focus]:outline-1 data-[focus]:outline-white">
          {name}
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom"
          className="divide-y divide-white/5 rounded-sm bg-white text-black text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
        >
          <div className="p-3">
            <a
              className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
              href="#"
            >
              <p className="font-semibold ">Profile</p>
            </a>
            <a
              className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
              href="#"
            >
              <p className="font-semibold ">Logout</p>
            </a>
          </div>
        </PopoverPanel>
      </Popover>
    );
  };
  return (
    <div>
      <div className="flex min-h-14 h-16 w-full px-8 items-center justify-between bg-slate-400/15 border-b-0 border-gray-900 shadow-sm shadow-slate-200">
        <img
          src={logo}
          alt="zemplee logo"
          className="object-contain w-10 h-10"
        />
        <div className="flex gap-12">
          {orgLogo ?? (
            <img
              src={orgLogo}
              alt=""
              className="border-gray-200 w-20  object-contain border-[1px]"
            />
          )}
          {Profile()}
        </div>
      </div>
      <div className="h-8 bg-[var(--pink)] pl-8 align-middle content-center text-white font-semibold">Daily Activity </div>
    </div>
  );
};

export default Header;
