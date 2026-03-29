/**
 * Generate a PDF for a given quote.
 *
 * TODO: Implement with @react-pdf/renderer
 * For now, returns null -- quotes can still be viewed via the public URL.
 */
export async function generateQuotePDF(
  quoteId: string,
): Promise<Buffer | null> {
  void quoteId; // avoid unused-variable lint error
  return null;
}
