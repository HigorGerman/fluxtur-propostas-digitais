export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "");
  const limited = digits.slice(0, 11);
  if (limited.length <= 3) {
    return limited;
  }
  if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  }
  if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  }
  return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
}

export function formatDate(value: string): string {
  const digits = value.replace(/\D/g, "");
  const limited = digits.slice(0, 8);
  if (limited.length <= 2) {
    return limited;
  }
  if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }
  return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
}

export function cleanMask(value: string): string {
  return value.replace(/[.\-/]/g, "");
}
