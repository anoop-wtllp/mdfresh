"use client";

import { useId, useState, type FormEvent } from "react";
import { CONTACT, MARKETS, PRODUCTS } from "@/lib/content";

const FIELD =
  "w-full rounded-xl border rule bg-ink px-4 py-3.5 text-[0.9375rem] text-frost placeholder:text-frost-mute transition-colors duration-300 hover:border-frost/25 focus:border-pea focus:outline-none";

const LABEL =
  "mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-frost-mute";

/**
 * Enquiry form.
 *
 * There is no mail transport behind this site yet, so rather than a submit that
 * silently goes nowhere, it composes the message and hands it to the visitor's
 * own mail client. Everything they typed survives the handoff, and the button
 * says where it is going. Swap the `onSubmit` body for a server action once an
 * endpoint exists — the markup does not need to change.
 */
export function EnquiryForm() {
  const id = useId();
  const [handedOff, setHandedOff] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const subject = `Enquiry: ${get("interest")} — ${get("company") || get("name")}`;
    const body = [
      `Name: ${get("name")}`,
      `Company: ${get("company") || "—"}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone") || "—"}`,
      `Interested in: ${get("interest")}`,
      "",
      "Requirement:",
      get("message"),
    ].join("\n");

    // Clicking a synthesised anchor rather than assigning `location`: a mailto:
    // handed to the address bar is a navigation the browser may or may not
    // reverse, and this leaves the page exactly where it was either way.
    const link = document.createElement("a");
    link.href = `${CONTACT.emailHref}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    link.rel = "noopener";
    link.click();
    setHandedOff(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className={LABEL}>
          Name
        </label>
        <input
          id={`${id}-name`}
          name="name"
          required
          autoComplete="name"
          placeholder="Your full name"
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor={`${id}-company`} className={LABEL}>
          Company
        </label>
        <input
          id={`${id}-company`}
          name="company"
          autoComplete="organization"
          placeholder="Business name"
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={LABEL}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={FIELD}
        />
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className={LABEL}>
          Phone
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91"
          className={FIELD}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-interest`} className={LABEL}>
          Interested in
        </label>
        <select
          id={`${id}-interest`}
          name="interest"
          defaultValue="General enquiry"
          className={FIELD}
        >
          <option>General enquiry</option>
          <optgroup label="Products">
            {PRODUCTS.map((product) => (
              <option key={product.name}>{product.name}</option>
            ))}
          </optgroup>
          <optgroup label="Supply">
            {MARKETS.map((market) => (
              <option key={market.id}>{market.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={LABEL}>
          Requirement
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          placeholder="Volumes, pack sizes, delivery location and timelines."
          className={`${FIELD} resize-y`}
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-pea px-7 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-pea-bright sm:w-auto"
        >
          Send enquiry
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </button>

        {/* Announced, not just shown: the mail client opens in another window
            and the visitor may never see this area change. */}
        <p
          role="status"
          className="mt-4 text-[0.8125rem] leading-relaxed text-frost-mute"
        >
          {handedOff
            ? `Your email app should now be open with the details filled in. If nothing happened, write to ${CONTACT.email} directly.`
            : "Opens in your email app with the details filled in, ready to send."}
        </p>
      </div>
    </form>
  );
}
