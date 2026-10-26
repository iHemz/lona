// Stand-in for the phone verification backend until one exists. Calls are async with a short
// delay so the UI's loading and error states are exercised like the real thing.

export const VERIFICATION_CODE_LENGTH = 6;

const NETWORK_DELAY_MS = 600;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sends a verification code by SMS to an E.164 number. */
export async function sendVerificationCode(_phoneE164: string): Promise<void> {
  await wait(NETWORK_DELAY_MS);
}

/** Checks a code. The mock accepts any code of the right length. */
export async function verifyCode(_phoneE164: string, code: string): Promise<boolean> {
  await wait(NETWORK_DELAY_MS);
  return new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`).test(code);
}
