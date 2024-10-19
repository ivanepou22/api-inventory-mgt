function incrementString(str: string): string {
  // Regex to match the non-digit prefix and the numeric part
  const match = str.match(/([^\d]*)(\d+)(.*)/);

  if (match) {
    const prefix = match[1]; // Non-digit prefix
    let num = parseInt(match[2], 10); // Numeric part
    const suffix = match[3]; // Suffix (if any)

    // Increment the number
    num++;

    // Create the new numeric string with leading zeros preserved
    const newNum = num.toString().padStart(match[2].length, "0");

    // Return the new string
    return `${prefix}${newNum}${suffix}`;
  }

  return str; // Return unchanged if format is not recognized
}
