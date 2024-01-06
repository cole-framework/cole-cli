export class CliOptionsTools {
  public static splitArrayOption(value: string[]): Set<string> {
    const parts = new Set<string>();

    if (Array.isArray(value)) {
      value.forEach((str) => {
        const list = str.split(/,/);
        list.forEach((item) => {
          if (item) {
            parts.add(item.trim());
          }
        });
      });
    }

    return parts;
  }
}
