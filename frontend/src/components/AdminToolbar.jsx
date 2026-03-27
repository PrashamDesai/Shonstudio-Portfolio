import { useAdmin } from "../context/AdminContext.jsx";

const AdminToolbar = () => {
  const { isAdmin, logout } = useAdmin();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[150]">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-surface/85 px-4 py-3 shadow-soft backdrop-blur-xl">
        <span className="text-[11px] uppercase tracking-[0.28em] text-accentSoft">
          Admin mode
        </span>
        <button
          type="button"
          onClick={logout}
          className="theme-button-secondary rounded-full px-4 py-2 text-xs font-semibold"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default AdminToolbar;
