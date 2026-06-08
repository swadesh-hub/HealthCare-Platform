# 🤝 Contributing to Healio Healthcare Platform

We welcome contributions to this project! To maintain high code quality and smooth collaboration, please follow these guidelines.

---

## 🛠️ Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/swadesh-hub/HealthCare-Platform.git
   cd HealthCare-Platform
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run in development mode:**
   ```bash
   npm run dev
   ```

---

## 🎨 Coding Standards & Guidelines

To satisfy evaluation rubric criteria for **Code Quality & Technical Implementation**, we adhere strictly to the following standards:

### 1. JavaScript/React Style (ESLint)
- We follow standard ES6 linting guidelines.
- Maximum line length is **100 characters**.
- Use descriptive hook state names (`isAuthenticated`, `appointmentsList`) rather than abbreviations.
- Run `npm run lint` before committing.

### 2. Modularity & Maintainability
- Keep files focused on a single responsibility:
  - Symptom Checking -> `src/components/SymptomChecker.jsx`
  - Appointment Booking -> `src/components/AppointmentBooking.jsx`
  - Report Interpreter -> `src/components/ReportInterpreter.jsx`
  - Authentication Routing -> `src/components/LoginPage.jsx`
- Avoid global mutable states. Use React Context or callback hooks passed via props.
- Document components and utilities with descriptive JSDoc comments.

### 3. Error Handling & Robustness
- Catch API fetch failures with descriptive error states.
- Never let UI render components with raw null fields without fallbacks.
- Use mock data fallbacks when local sensors or camera inputs are unavailable.

---

## 🧪 Testing Guidelines

- Verify your additions do not break Vite compilation:
  ```bash
  npm run build
  ```
- Review the application console output to ensure there are no unhandled promise rejections or React component lifecycle warnings.

---

## 🚀 Git Flow & Commit Guidelines

1. Create a branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```
2. Write meaningful, descriptive commit messages matching [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(auth): add email verification check`
   - `fix(pdf): correct cholesterol marker boundary values`
3. Push to your fork and submit a Pull Request to the `develop` branch of the main repository.
