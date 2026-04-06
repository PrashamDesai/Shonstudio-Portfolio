import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-white/8 bg-surface/75 backdrop-blur-xl">
    <div className="mx-auto grid max-w-[1760px] gap-10 px-3 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 2xl:px-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.28em] text-mutedDeep">ShonStudio</p>
        <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Playable ideas. Scalable impact.
        </h2>
        <p className="max-w-lg text-sm text-muted">
          Execution defines everything, turning ideas into experiences that hold attention and deliver real impact.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
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
