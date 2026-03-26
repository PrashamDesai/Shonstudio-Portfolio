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
    <form onSubmit={handleSubmit} className="section-shell panel-glow space-y-5 p-6 sm:p-8">
      <div className="space-y-2">
        <p className="eyebrow">Contact</p>
        <h3 className="font-display text-3xl font-semibold tracking-tight text-white">
          Let&apos;s shape the right version of the idea.
        </h3>
        <p className="text-sm leading-7 text-muted">
          Send a concise brief and the form will open your default mail client with everything
          prefilled.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-muted">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3 outline-none"
            placeholder="Your name"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3 outline-none"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-muted">
        <span>Project type</span>
        <input
          type="text"
          name="projectType"
          value={form.projectType}
          onChange={handleChange}
          className="theme-input w-full rounded-2xl px-4 py-3 outline-none"
          placeholder="XR prototype, mobile game, teaching module..."
        />
      </label>

      <label className="space-y-2 text-sm text-muted">
        <span>Brief</span>
        <textarea
          name="brief"
          value={form.brief}
          onChange={handleChange}
          rows="5"
          className="theme-input w-full rounded-3xl px-4 py-3 outline-none"
          placeholder="Tell us what you want to build, where you are in the process, and what kind of support you need."
        />
      </label>

      <button
        type="submit"
        className="theme-button-primary inline-flex rounded-full px-5 py-3 text-sm font-semibold"
        data-cursor="link"
      >
        Open drafted email
      </button>
    </form>
  );
};

export default ContactPanel;
