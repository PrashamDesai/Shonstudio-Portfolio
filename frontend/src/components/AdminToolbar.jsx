import { useAdmin } from "../context/AdminContext.jsx";

const AdminToolbar = () => {
  const { isAdmin, logout, openLogin } = useAdmin();

  return (
    <div className="fixed bottom-5 right-5 z-[150]">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-base/85 px-4 py-3 shadow-soft backdrop-blur-xl">
        <span className={`text-[11px] uppercase tracking-[0.28em] ${isAdmin ? "text-accentSoft" : "text-muted"}`}>
          {isAdmin ? "Admin mode" : "Admin locked"}
        </span>
        {isAdmin ? (
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white transition hover:border-accent/20 hover:bg-white/[0.08]"
          >
            Log out
          </button>
        ) : (
          <button
            type="button"
            onClick={openLogin}
            className="theme-button-primary rounded-full px-4 py-2 text-xs font-semibold"
          >
            Admin login
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminToolbar;
