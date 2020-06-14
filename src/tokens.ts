/**
 * Represents a token.
 */
export interface Token {
    /**
     * The value of the token.
     */
    readonly value: string;

    /**
     * The raw value of the token e.g. with quotes.
     */
    readonly raw: string;

    /**
     * Trailing whitespace.
     */
    readonly trailing: string;
}

/**
 * Joins tokens together.
 * By default, this keeps as much of the original input as possible.
 * @param tokens - Tokens to join.
 * @param separator - The separator, if null, will use original trailing whitespace; defaults to null.
 * @param raw - Whether to use raw values e.g. with quotes; defaults to true.
 * @returns The joined string.
 */
export function joinTokens(tokens: Token[], separator: string | null = null, raw = true): string {
    if (separator != null && !raw) {
        return tokens.map(t => t.value).join(separator);
    }

    const xs = [];
    for (let i = 0; i < tokens.length - 1; i++) {
        const t = tokens[i];
        xs.push(raw ? t.raw : t.value);
        xs.push(separator ?? t.trailing);
    }

    const last = tokens[tokens.length - 1];
    xs.push(raw ? last.raw : last.value);
    return xs.join('');
}

/**
 * Extracts a command from the first one or two tokens from a list of tokens.
 * The command format is '<prefix> <command>', and the space is optional.
 * @param matchPrefix - A function that gives the length of the prefix if there is one.
 * @param tokens - Tokens to check.
 * @param mutate - Whether to mutate the list of tokens.
 * @returns The token containing the name of the command.
 * This may be a token from the list or a new token.
 */
export function extractCommand(matchPrefix: (s: string) => number | null, tokens: Token[], mutate = true): Token | null {
    if (tokens.length < 1) {
        return null;
    }

    const plen = matchPrefix(tokens[0].raw);
    if (plen == null) {
        return null;
    }

    if (tokens[0].raw.length === plen) {
        if (tokens.length < 2) {
            return null;
        }

        if (mutate) {
            tokens.shift();
            return tokens.shift()!;
        }

        return tokens[1];
    }

    if (mutate) {
        const t = tokens.shift()!;
        const v = t.raw.slice(plen);
        return { value: v, raw: v, trailing: t.trailing };
    }

    const v = tokens[0].raw.slice(plen);
    return { value: v, raw: v, trailing: tokens[0].trailing };
}
