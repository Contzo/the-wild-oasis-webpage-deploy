import SideNavigation from "../_components/SideNavigation";
export const metadata = {
  title: "Account",
};
export default function Layout({ children }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] gap-12">
      <SideNavigation />
      <div>{children}</div>
    </div>
  );
}
