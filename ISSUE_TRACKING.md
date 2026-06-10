# 📋 Project Issue Tracking & Lifecycle Management

This document describes the issue tracking lifecycle, categorization, and the historical issues resolved during the development of the **Healio AI Healthcare Assistant**.

---

## 🔍 1. Issue Tracking Lifecycle

Every bug, feature request, or technical chore follows a strict pipeline:

```
[ New/Backlog ] ──> [ Triaged & Labeled ] ──> [ In Progress ] ──> [ In Review/PR ] ──> [ Closed/Resolved ]
```

### 🏷️ Labels & Categorization
We utilize the following labels to categorize project issues:
- `bug` (Red): Something isn't working as expected.
- `enhancement` (Blue): New feature request or performance optimization.
- `documentation` (Yellow): Updates to README, project reports, or API docs.
- `critical` (Dark Red): Blocks core execution or causes system crashes.
- `good first issue` (Green): Easy task suitable for new contributors.

---

## 🗃️ 2. Historical Dev Log: Resolved Issues

The following issues were tracked, triaged, and resolved during the course of the project development lifecycle:

### #101 [BUG] Patient PDF Report Interpreter failing on Multi-Column PDF formats
- **Type:** Bug | **Severity:** Critical
- **Description:** Uploading multi-column medical laboratory reports caused the OCR/Regex parser to read columns horizontally, mixing up blood marker names and patient readings.
- **Resolution:**
  - Integrated structured parser blocks to detect layout columns before running pattern matching.
  - Added fallback checks to align matching biomarker names with reference intervals properly.

### #102 [ENHANCEMENT] Add Secure Authentication State and Sign Out routes
- **Type:** Enhancement | **Severity:** High
- **Description:** The system initialized directly into the main Patient Copilot view without asking users to log in, violating HIPAA privacy principles on shared devices.
- **Resolution:**
  - Built a secure login and signup interface (`LoginPage.jsx`).
  - Added session state management in `App.jsx` to redirect unauthenticated users to the Landing Page.
  - Implemented dynamic navigation headers and logout buttons in the sidebar and header.

### #103 [BUG] Geolocation Hospital Finder failing on Null coordinates
- **Type:** Bug | **Severity:** Medium
- **Description:** If users denied location access, the Hospital Finder crashed with a rendering error because coordinates returned null.
- **Resolution:**
  - Added location service error catching.
  - Implemented fallback default coordinate mapping to a central city coordinate, displaying a helpful "Location access denied; displaying default region" banner.

---

## 📌 3. Open Backlog / Future Enhancements

These items are current items in the project backlog:
1. **[Backlog #201] Offline Sync for Wellness Logs:** Sync telemetry logs back to the server once internet access is restored.
2. **[Backlog #202] Speech-to-Text for Symptom Checker:** Allow elderly patients to speak their symptoms aloud.
