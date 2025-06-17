import type { DevLocale, MessageKey } from "./type";
import { defaultLocale, getMessageFromLocale } from "./getMessageFromLocale";

type I18nValue = {
  message: string;
  placeholders?: Record<string, { content?: string; example?: string }>;
};

function translate(key: MessageKey, substitutions?: string | string[]) {
  const value = getMessageFromLocale(t.devLocale)[key] as I18nValue;
  let message = value.message;

  if (value.placeholders) {
    Object.entries(value.placeholders).forEach(([key, { content }]) => {
      if (!content) return;
      message = message.replace(new RegExp(`\\$${key}\\$`, "gi"), content);
    });
  }
  if (!substitutions) {
    return message;
  }

  if (Array.isArray(substitutions)) {
    return substitutions.reduce(
      (acc, cur, idx) => acc.replace(`$${idx + 1}`, cur),
      message
    );
  }
  // 单个字符串直接替换
  return message.replace(/\$(\d+)/, substitutions);
}

function removePlaceholder(message: string) {
  return message.replace(/\$(\d+)/g, "");
}

export const t = (...args: Parameters<typeof translate>) => {
  return removePlaceholder(translate(...args));
};

t.devLocale = defaultLocale as DevLocale;
