import SettingsNav from "./_components/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <SettingsNav />
      {children}
    </div>
  );
}
