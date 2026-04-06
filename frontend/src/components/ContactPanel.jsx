import { useState } from "react";

const ContactPanel = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    brief: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(`New ShonStudio enquiry: ${form.projectType || "Project"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.projectType}\n\nBrief:\n${form.brief}`,
    );

    window.location.href = `mailto:hello@shonstudio.dev?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="section-shell panel-glow space-y-6 p-6 sm:space-y-7 sm:p-8">
      <div className="space-y-2">
        <p className="eyebrow">Contact</p>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Start with a focused brief.
        </h3>
        
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2.5">
          <span className="text-sm font-medium leading-6 text-muted">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="theme-input h-12 w-full rounded-2xl px-4 outline-none"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2.5">
          <span className="text-sm font-medium leading-6 text-muted">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="theme-input h-12 w-full rounded-2xl px-4 outline-none"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="grid gap-2.5">
        <span className="text-sm font-medium leading-6 text-muted">Project type</span>
        <input
          type="text"
          name="projectType"
          value={form.projectType}
          onChange={handleChange}
          className="theme-input h-12 w-full rounded-2xl px-4 outline-none"
          placeholder="XR prototype, mobile game, teaching module..."
        />
      </label>

      <label className="grid gap-2.5">
        <span className="text-sm font-medium leading-6 text-muted">Brief</span>
        <textarea
          name="brief"
          value={form.brief}
          onChange={handleChange}
          rows="5"
          className="theme-input min-h-[10.5rem] w-full rounded-3xl px-4 py-3 outline-none"
          placeholder="Tell us what you want to build, where you are in the process, and what kind of support you need."
        />
      </label>

      <button
        type="submit"
        className="theme-button-primary inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] sm:w-auto"
        data-cursor="link"
      >
        Send project brief
      </button>
    </form>
  );
};

export default ContactPanel;
