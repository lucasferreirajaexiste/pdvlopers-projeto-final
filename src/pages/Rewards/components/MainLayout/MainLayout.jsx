
export const MainLayout = ({ children, title }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {children}
    </div>
  );
};