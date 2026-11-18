"use client";

import dynamic from "next/dynamic";

/**
 * Server-rendered contact form whose code lives in its own chunk. Pages that show the form
 * (contact page) get it in the HTML and load the chunk; pages that do not never download it.
 * (All pages share one route, so a static import would ship the form library everywhere.)
 */
export const ContactFormLoader = dynamic(() => import("./contact-form").then((m) => m.ContactForm));
