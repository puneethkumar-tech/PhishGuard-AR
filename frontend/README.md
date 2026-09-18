

## Mission

Turn the team's technical work into a clear, attractive, reliable user experience and a convincing live demonstration.

## Your judging-criteria contribution

| Criterion | Your proof |
|---|---|
| Wow Factor | Live original/attacked/hardened comparison and optional phone alert |
| Build Quality | Frontend separated from API calls; graceful error handling |
| User Love | Simple workflow, readable results, accessible colors, useful guidance |
| Real-World Ready | Consent-based alerts, configurable integrations, safe defaults |
| Pitch Power | Clear five-part story, chart, demo script, backup recording |

## Priority order

1. Build a working Streamlit screen with manual text input.
2. Connect to the backend health endpoint.
3. Connect to the scan endpoint.
4. Display verdict, threat type, score type, language, severity, and recommendation.
5. Add evidence/highlights.
6. Add original/attacked/hardened comparison.
7. Add dashboard charts from real CSV/API data.
8. Add SMS/WhatsApp/Gmail features only if the core flow is stable.
9. Prepare slides and a backup screen recording.

## Suggested interface

### Main pages

- **Scan:** Paste a message and scan it.
- **Robustness Lab:** Compare clean, attacked, and hardened outputs.
- **History:** View the user's previous scans.
- **Dashboard:** Show measured counts and trends.
- **Report:** Display or export a report after authorization.
- **Settings:** Enable/disable alerts and show integration status.

## Required deliverables

```text
app/streamlit_app.py
app/api_client.py
app/components/
app/pages/
app/assets/
docs/DEMO_SCRIPT.md
docs/PITCH_SLIDES.md
results/demo_screenshots/
```

## UX requirements

- Clearly distinguish `score` from `probability`.
- Show a loading state during API calls.
- Handle API offline, timeout, invalid input, and authentication errors.
- Never expose tokens in the UI.
- Use plain-language recommendations:
  - Do not click unknown links.
  - Verify through an official channel.
  - Do not share OTPs or passwords.
- Make the attack transformation visible but clearly labeled as a test.
- Explain that model highlights are evidence used by the model, not proof of intent.

## Alert integration

Use adapters rather than hardcoding providers into the UI:

```text
src/integrations/
â”œâ”€â”€ sms.py
â”œâ”€â”€ whatsapp.py
â”œâ”€â”€ gmail.py
â””â”€â”€ email.py
```

Requirements:

- Use sandbox/test accounts where possible.
- Obtain explicit user consent before sending alerts.
- Include a dry-run mode.
- Log provider status without logging secrets.
- Show whether the integration is configured, not whether an untested alert was sent.
- Keep alerts optional so the core demo works without paid services.

## Pitch structure: five slides

1. **Problem:** Static detectors can fail under small text transformations.
2. **Approach:** Detect â†’ attack â†’ harden â†’ explain â†’ alert.
3. **Proof:** Clean versus attacked versus hardened measurements.
4. **Experience:** Simple scan UI and recommended user action.
5. **Future:** More languages, broader data, production monitoring, stronger evaluation.

## Demo script

1. Open the scan page.
2. Paste a suspicious sample.
3. Show the verdict and evidence.
4. Open the robustness lab.
5. Apply one attack.
6. Show the measured result.
7. Apply hardening.
8. Show the hardened result.
9. Explain the limitation and next improvement.
10. Trigger an alert only if it is genuinely configured and tested.

## Handoffs

| Deliverable | Receiver | Deadline |
|---|---|---|
| UI skeleton | C | Hour 11 |
| API client contract | C | Hour 12 |
| Attack comparison screen | B | Hour 16 |
| Dashboard charts | B and A | Hour 22 |
| Final demo flow | Everyone | Hour 24 |
| Slides and backup recording | Everyone | Hour 27 |

## Acceptance checklist

- [ ] App starts from a clean checkout.
- [ ] API URL is configurable through environment variables.
- [ ] Offline API errors are readable.
- [ ] No secrets are committed.
- [ ] Real metrics are loaded from CSV/API.
- [ ] Demo uses fixed, documented examples.
- [ ] Alert features have a dry-run path.
- [ ] Slides contain no invented numbers.