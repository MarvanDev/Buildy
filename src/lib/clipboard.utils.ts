export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (!navigator?.clipboard) throw new Error('Clipboard API not available');
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copiando al portapapeles:', error);
    return false;
  }
};