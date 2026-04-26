# Super Smart 2026 — Incident Runbook

**Read at 2am. Action-only. No philosophy.**

For the *why* behind any of this, see `super_smart_2026_mothership.md`. This file is what to *do* when something is broken.

**Living document.** Update after every actual incident with the postmortem. Pre-launch, it's a draft against expected failure modes.

---

## Kill switches (memorize these)

| Flag (PostHog) | What it does |
|---|---|
| `app_emergency_disable` | Whole-app maintenance screen. Nuclear option. |
| `daily_race_disabled` | Hides Daily Race card on home; existing in-flight rounds finish. |
| `quickmatch_disabled` | Hides Quickmatch card on home. |
| `pro_purchase_disabled` | "One More" still works; Pro Wall hides "buy" button, shows "back soon." |
| `live_question_emergency_recall_<question_id>` | Pulls a single question from active sets. Tier 3 recall path per mothership Part 8. |

All flags have hardcoded fallbacks (Flexibility Architecture, mothership Part 7). If PostHog itself is down, the app still runs on defaults.

---

## Detection — how you'll find out

- **Sentry crash alerts** → email + push to your phone (Tier 1 instrumentation, mothership Part 6).
- **PostHog dashboard** → daily-active-users dropping, conversion funnel breaking.
- **Player email** → `support@iamsupersmart.com` (Profile → Contact the developer).
- **Your own play** → keep a Pro account, play one round daily.

If a Sentry alert fires at 2am, you don't have to fix it instantly — you have to *mitigate* it. Fix in calm.

---

## Severity classification

| Severity | Definition | Response time |
|---|---|---|
| **SEV1 — fire** | App unusable, data loss, offensive content live, payments broken | Now. Wake up. |
| **SEV2 — smell** | Feature broken but app works (ghost matchmaking down, Daily Race seed weird) | Within 4 hours. |
| **SEV3 — annoyance** | Cosmetic, edge case, single-player issue | Next business day. |

When in doubt, treat as one severity higher. Easier to wind down than to wind up.

---

## Scenario 1 — Whole-app crash spike

**Detection:** Sentry alert "crash rate > 5%" or App Store reviews tanking.

**Severity:** SEV1.

**Mitigation:**
1. Open Sentry → identify the crashing component.
2. If it's a JS error → push EAS Update with previous build (one command, no App Store review).
3. If it's native (rare, only on full version bump) → flip `app_emergency_disable` flag. Players see maintenance screen.
4. Fix in calm, ship hotfix EAS Update.

**Don't:**
- Push a quick fix without testing on a device first.
- Submit a new App Store binary at 2am — review takes 24h.

**Recovery:** None usually needed. Crashes don't corrupt data.

---

## Scenario 2 — Daily Race seed broken / corrupted

**Detection:** Sentry errors on the daily race screen, or players reporting a broken set.

**Severity:** SEV1 (affects every player today).

**Mitigation:**
1. Flip `daily_race_disabled` → true. App hides Daily Race card.
2. In Supabase: `UPDATE daily_races SET status='cancelled' WHERE date = current_date_et()`.
3. Manually trigger the `daily_race_seed` Edge Function with `force=true` for the next available window.
4. Flip flag back when verified.

**Don't:**
- Edit `sessions` rows — historical scores never get retroactively edited (mothership Part 8).

**Recovery:** Per mothership Tier 3 recall (Appendix D #25, RESOLVED 2026-04-24): goodwill compensation = streak restored + 1 Streak Shield credit to every player who attempted today. Trigger the goodwill Edge Function once the new seed is live.

---

## Scenario 3 — Quickmatch ghost matchmaking down

**Detection:** Sentry timeout errors on the matchmaking Edge Function, or players reporting "stuck on FINDING YOUR GHOST" screen.

**Severity:** SEV2.

**Mitigation:**
1. Check Supabase function logs first — usually a query timeout when ghost pool is hot.
2. If sustained, flip `quickmatch_disabled` → true. Players see Daily Race only.
3. If only specific skill tiers affected, narrow the flag (`quickmatch_disabled_tier_<n>`) — *flag does not exist yet, build if pattern recurs*.

**Don't:**
- Insert fake ghosts manually — bot-fill is the legit fallback (mothership Part 4 Layer 1).

**Recovery:** None — Quickmatch is ephemeral, no state to repair.

---

## Scenario 4 — Pro purchase / IAP failing

**Detection:** RevenueCat dashboard shows failed receipt validations, or player email "I paid and didn't get Pro."

**Severity:** SEV1 if widespread, SEV2 if isolated.

**Mitigation:**
1. Check RevenueCat status page first — most outages are theirs.
2. If RevenueCat is up but failing for one player: manually grant Pro via `pro_entitlements` table insert + 24h grace period (Appendix D #18, still open as of 2026-04-25 — finalize before launch).
3. If widespread: flip `pro_purchase_disabled`. Pro Wall hides "buy" button, shows "back soon" copy (see voice copy below).

**Don't:**
- Refund without checking if the receipt is valid — RevenueCat may already be processing.
- Promise specific ETA in your reply — you don't know.

**Recovery:** Once RevenueCat resumes, re-run validation for any pending receipts. Reach out to affected users via email with a thank-you note.

---

## Scenario 5 — Offensive / wrong question goes live (Tier 3 recall)

**Detection:** Player email, social media call-out, or your own review.

**Severity:** SEV1 — drop everything.

**Mitigation:**
1. Identify the question ID in Supabase.
2. `UPDATE questions SET active=false WHERE id=<id>` (Tier 2 soft-retire if it's just wrong).
3. If actively offensive (Tier 3 recall, mothership Part 8): also invalidate active question sets containing it. SQL:
   ```sql
   UPDATE question_sets SET status='invalidated'
   WHERE id IN (SELECT question_set_id FROM question_set_items WHERE question_id=<id>);
   ```
4. Flip `live_question_emergency_recall_<id>` → true (filters from any in-flight session).
5. Cancel today's Daily Race if it contained the question; re-seed.

**Don't:**
- Edit the question in place if it's offensive — soft-retire and replace.
- Apologize publicly before you've stopped the bleeding.

**Recovery:** Goodwill compensation per mothership Tier 3 (Appendix D #25). Add a postmortem entry to `audit_1001/audit_1001_methodology.md` ruling list if a new edge case surfaced. Email the player who flagged it (you owe them).

---

## Scenario 6 — Supabase / database outage

**Detection:** Sentry shows database connection errors across the board, or Supabase status page red.

**Severity:** SEV1.

**Mitigation:**
1. Confirm via Supabase status page (not your own dashboard, which is also down).
2. Flip `app_emergency_disable` → maintenance screen (note: this flag itself is served from PostHog, which is independent of Supabase — it'll work).
3. **Wait.** Supabase has 99.9% SLA; outages are usually <1 hour.
4. Once Supabase is back: flip flag off, monitor Sentry for catch-up errors.

**Don't:**
- Try to migrate to a different backend mid-incident.
- Manually restore from backup unless data loss is confirmed.

**Recovery:** Point-in-time recovery via Supabase dashboard if data is lost. Goodwill compensation if extended (>4hr) outage.

---

## Player-facing copy (review-locked)

These strings live in Supabase `ui_strings` table (Flexibility Architecture). Update via direct row edit — no deploy needed. **Voice-bearing — change only with creative-director review.**

| Key | Copy |
|---|---|
| `maintenance_screen_title` | `we'll be right back` |
| `maintenance_screen_body` | `we're patching things up. give us a sec.` |
| `daily_race_disabled_card` | `today's race is taking a nap. fresh one tomorrow at 6am.` |
| `pro_purchase_disabled_message` | `payments are temporarily down. nothing's wrong with your account.` |
| `goodwill_email_subject` | `we owe you one` |

---

## Vendor contacts

- **Apple Developer Support:** developer.apple.com/contact (account-level issues, Remove from Sale)
- **RevenueCat support:** support@revenuecat.com (IAP issues)
- **Supabase support:** supabase.com/dashboard/support (backend outages)
- **Expo / EAS support:** expo.dev/support (build / OTA update issues)
- **PostHog support:** posthog.com/support (flag dashboard issues)

Account credentials live in your password manager. **Do not commit them here.**

---

## Pre-launch chaos drill (do once before launch)

1. Pick a non-critical PostHog flag.
2. Flip it off in the dashboard.
3. Open the app on your phone — verify the change took effect.
4. Flip it back on.
5. Confirm the change reverted.

Goal: build muscle memory. The first time you do this should NOT be during an actual incident.

---

## Postmortem template

After every incident — fire or smell — fill this out:

```
Date:
Severity:
Detection:       (how did we find out?)
Time to mitigate: (from detection to flag flip)
Root cause:      (the actual underlying bug)
Player impact:   (how many, what they experienced)
Goodwill given:  (Streak Shields, Pro grants, refunds)
Runbook update:  (if a new failure mode → add scenario above)
Methodology update: (if a creative-editorial issue → audit_1001_methodology.md)
```

File postmortems in `supersmart/docs/postmortems/<YYYY-MM-DD>-<slug>.md`.

---

*Living document. Update after every incident.*
*Last updated: 2026-04-26 (pre-launch draft).*
