import express from "express";

import {
  createCourseAdmin,
  createTeamAdmin,
  createProjectAdmin,
  createServiceAdmin,
  createToolAdmin,
  createVisionSceneAdmin,
  deleteCourseAdmin,
  deleteTeamAdmin,
  deleteProjectAdmin,
  deleteServiceAdmin,
  deleteToolAdmin,
  deleteVisionSceneAdmin,
  loginAdmin,
  updateCompanyAdmin,
  updateCourseAdmin,
  updateTeamAdmin,
  updateProjectAdmin,
  updateServiceAdmin,
  updateToolAdmin,
  updateVisionSceneAdmin,
} from "../controllers/adminController.js";
import { getCompany } from "../controllers/companyController.js";
import { getTeamMembers } from "../controllers/teamController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();
const adminBasePath = "/api/shonstudio-admin-secured";

const createShell = (title, body, script = "") => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #090a12;
        --panel: rgba(18, 20, 33, 0.94);
        --panel-soft: rgba(28, 31, 48, 0.86);
        --border: rgba(255, 255, 255, 0.12);
        --text: #f8f8fb;
        --muted: #9fa6c3;
        --accent: #00d4ff;
        --accent-alt: #7a5cff;
        --danger: #ff7b7b;
        --success: #75f0b1;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        padding: 24px;
        background:
          radial-gradient(circle at top, rgba(0, 212, 255, 0.14), transparent 32%),
          radial-gradient(circle at 80% 0%, rgba(122, 92, 255, 0.16), transparent 26%),
          linear-gradient(180deg, #080910 0%, #0f1220 100%);
        color: var(--text);
        font-family: Arial, sans-serif;
      }

      .shell {
        width: min(100%, 1120px);
        margin: 0 auto;
        border: 1px solid var(--border);
        border-radius: 28px;
        background: var(--panel);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
        overflow: hidden;
      }

      .header {
        padding: 28px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background:
          radial-gradient(circle at top left, rgba(0, 212, 255, 0.14), transparent 36%),
          radial-gradient(circle at top right, rgba(122, 92, 255, 0.14), transparent 32%);
      }

      .eyebrow {
        margin: 0 0 10px;
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }

      h1, h2, h3, p {
        margin-top: 0;
      }

      h1 {
        margin-bottom: 12px;
        font-size: 32px;
        line-height: 1.1;
      }

      .subcopy {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.65;
      }

      .content {
        padding: 28px;
      }

      .grid {
        display: grid;
        gap: 18px;
      }

      .grid.two {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .panel {
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 22px;
        background: var(--panel-soft);
        padding: 20px;
      }

      .field {
        margin-bottom: 16px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        color: var(--muted);
        font-size: 13px;
      }

      input, select, textarea {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        padding: 14px 16px;
        font-size: 14px;
        outline: none;
      }

      textarea {
        min-height: 220px;
        resize: vertical;
        font-family: Consolas, monospace;
      }

      input:focus, select:focus, textarea:focus {
        border-color: rgba(0, 212, 255, 0.42);
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
      }

      .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      button {
        border: 0;
        border-radius: 999px;
        padding: 14px 18px;
        font-size: 14px;
        font-weight: 700;
        color: white;
        cursor: pointer;
        background: linear-gradient(135deg, var(--accent), var(--accent-alt));
      }

      button.secondary {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      button.danger {
        background: linear-gradient(135deg, #ff7b7b, #ff5a8b);
      }

      .message {
        min-height: 22px;
        margin-top: 14px;
        font-size: 13px;
        line-height: 1.5;
      }

      .message.error {
        color: var(--danger);
      }

      .message.success {
        color: var(--success);
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 13px;
        line-height: 1.65;
      }

      code {
        color: #b8f4ff;
      }

      .muted-list {
        margin: 0;
        padding-left: 18px;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.8;
      }

      @media (max-width: 880px) {
        .grid.two {
          grid-template-columns: 1fr;
        }

        body {
          padding: 16px;
        }

        .header,
        .content {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    ${body}
    <script>
      const ADMIN_BASE_PATH = "${adminBasePath}";
      ${script}
    </script>
  </body>
</html>`;

const createBootstrapPage = () =>
  createShell(
    "ShonStudio Admin",
    `<div class="shell">
      <div class="header">
        <p class="eyebrow">ShonStudio Admin</p>
        <h1>Loading admin panel</h1>
        <p class="subcopy">Checking your session and routing you to the correct admin page.</p>
      </div>
    </div>`,
    `
      const token = sessionStorage.getItem("shonstudioAdminToken");
      window.location.replace(token ? "/" : ADMIN_BASE_PATH + "/login");
    `,
  );

const createLoginPage = () =>
  createShell(
    "ShonStudio Admin",
    `<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div class="shell" style="max-width:420px; width: 100%;" id="page-container">
        <!-- Login form (shown when not logged in) -->
        <div id="login-form-container">
          <div class="header">
            <p class="eyebrow">ShonStudio Admin</p>
            <h1>Secure admin login</h1>
            <p class="subcopy">
              Sign in with the configured admin credentials to access the admin home and CRUD operations.
            </p>
          </div>
          <div class="content">
            <form id="admin-login-form">
              <div class="field">
                <label for="email">Email</label>
                <input id="email" name="email" type="email" autocomplete="username" required />
              </div>
              <div class="field">
                <label for="password">Password</label>
                <input id="password" name="password" type="password" autocomplete="current-password" required />
              </div>
              <button id="submit-button" type="submit">Log in</button>
              <div id="message" class="message"></div>
            </form>
          </div>
        </div>

        <!-- Logout page (shown when logged in) -->
        <div id="logout-container" style="display: none;">
          <div class="header">
            <p class="eyebrow">ShonStudio Admin</p>
            <h1>Admin session active</h1>
            <p class="subcopy">
              You are currently logged in to the admin panel. Go back to the portfolio or log out below.
            </p>
          </div>
          <div class="content">
            <div class="actions" style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button id="back-button" class="secondary" style="flex: 1;">Back to portfolio</button>
              <button id="logout-button" class="danger" style="flex: 1;">Log out</button>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    `
      const token = sessionStorage.getItem("shonstudioAdminToken");
      const loginFormContainer = document.getElementById("login-form-container");
      const logoutContainer = document.getElementById("logout-container");
      const form = document.getElementById("admin-login-form");
      const message = document.getElementById("message");
      const submitButton = document.getElementById("submit-button");
      const backButton = document.getElementById("back-button");
      const logoutButton = document.getElementById("logout-button");

      // Show the appropriate view based on login status
      if (token) {
        loginFormContainer.style.display = "none";
        logoutContainer.style.display = "block";
      } else {
        loginFormContainer.style.display = "block";
        logoutContainer.style.display = "none";
      }

      // Login form submission
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const payload = {
          email: formData.get("email"),
          password: formData.get("password"),
        };

        message.className = "message";
        message.textContent = "";
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        try {
          const response = await fetch(ADMIN_BASE_PATH + "/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || "Login failed");
          }

          sessionStorage.setItem("shonstudioAdminToken", result.token);
          loginFormContainer.style.display = "none";
          logoutContainer.style.display = "block";
        } catch (error) {
          message.className = "message error";
          message.textContent = error.message || "Unable to log in";
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Log in";
        }
      });

      // Back to portfolio button
      backButton.addEventListener("click", () => {
        window.location.replace("/");
      });

      // Logout button
      logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("shonstudioAdminToken");
        loginFormContainer.style.display = "block";
        logoutContainer.style.display = "none";
        message.className = "message success";
        message.textContent = "Logged out successfully";
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    `,
  );

router.get("/", (req, res) => {
  res.type("html").send(createBootstrapPage());
});

router.get("/login", (req, res) => {
  res.type("html").send(createLoginPage());
});

router.get("/home", (req, res) => {
  res.redirect("/");
});

router.post("/login", loginAdmin);
router.get("/company", getCompany);
router.get("/team", getTeamMembers);

router.use(verifyAdmin);

router.route("/projects").post(createProjectAdmin);
router.route("/projects/:id").put(updateProjectAdmin).delete(deleteProjectAdmin);

router.route("/services").post(createServiceAdmin);
router.route("/services/:id").put(updateServiceAdmin).delete(deleteServiceAdmin);

router.route("/tools").post(createToolAdmin);
router.route("/tools/:id").put(updateToolAdmin).delete(deleteToolAdmin);

router.route("/training").post(createCourseAdmin);
router.route("/training/:id").put(updateCourseAdmin).delete(deleteCourseAdmin);

router.route("/company").put(updateCompanyAdmin);

router.route("/team").post(createTeamAdmin);
router.route("/team/:id").put(updateTeamAdmin).delete(deleteTeamAdmin);

router.route("/vision-scenes").post(createVisionSceneAdmin);
router.route("/vision-scenes/:id").put(updateVisionSceneAdmin).delete(deleteVisionSceneAdmin);

export default router;
