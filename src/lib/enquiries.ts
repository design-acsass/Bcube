import { supabase } from "@/integrations/supabase/client";

export type EnquiryInput = {
  /** Where the form lives: "home" | "contact" | "product" | "bulk". */
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Anything extra the form captured (product slug, quantity, configuration…). */
  payload?: Record<string, unknown>;
};

/** Saves an enquiry so the shop owner can read it in the admin panel. */
export async function submitEnquiry(input: EnquiryInput): Promise<boolean> {
  const { error } = await supabase.from("enquiries").insert({
    source: input.source,
    name: input.name ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
    message: input.message ?? "",
    payload: (input.payload ?? {}) as never,
  });
  if (error) {
    console.error("enquiry failed", error);
    return false;
  }
  return true;
}
