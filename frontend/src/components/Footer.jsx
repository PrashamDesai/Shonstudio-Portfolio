import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-white/8 bg-surface/75 backdrop-blur-xl">
    <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.28em] text-mutedDeep">ShonStudio</p>
        <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Minimal design. Strong execution. Immersive digital products.
        </h2>
        <p className="max-w-lg text-sm text-muted">
          We build game and XR experiences with a product mindset and studio-level craft.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Navigate</p>
          <Link to="/projects" className="theme-link block text-sm text-muted">
            Projects
          </Link>
          <Link to="/services" className="theme-link block text-sm text-muted">
            Services
          </Link>
          <Link to="/training" className="theme-link block text-sm text-muted">
            Training
          </Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">About</p>
          <Link to="/company" className="theme-link block text-sm text-muted">
            Company
          </Link>
          <Link to="/team" className="theme-link block text-sm text-muted">
            Team
          </Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Contact</p>
          <a
            href="mailto:hello@shonstudio.dev"
            className="theme-link block text-sm text-muted"
          >
            hello@shonstudio.dev
          </a>
          <p className="text-sm text-muted">+91 9876543210</p>
          <p className="text-sm text-muted">From ideas to immersion.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
