/* 
 Copyright (c) 2015, Laurent Bourges. All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 - Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 - Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.samsung.sds.brightics.common.data.util;

/**
 * Fast number Parser
 *
 * TODO: 
 * - move into a dedicated package + Fix License.
 * - check overflows !
 * - add benchmark and results
 * 
 * @author Laurent Bourges
 */
public final class NumberParser {

    private final static boolean USE_POW_TABLE = true;

    // Precompute Math.pow(10, n) as table:
    private final static int POW_RANGE = (USE_POW_TABLE) ? 256 : 0;
    private final static double[] POS_EXPS = new double[POW_RANGE];
    private final static double[] NEG_EXPS = new double[POW_RANGE];

    static {
        for (int i = 0; i < POW_RANGE; i++) {
            POS_EXPS[i] = Math.pow(10., i);
            NEG_EXPS[i] = Math.pow(10., -i);
        }
    }

    // Calculate the value of the specified exponent - reuse a precalculated value if possible
    private final static double getPow10(final int exp) {
        if (USE_POW_TABLE) {
            if (exp > -POW_RANGE) {
                if (exp <= 0) {
                    return NEG_EXPS[-exp];
                } else if (exp < POW_RANGE) {
                    return POS_EXPS[exp];
                }
            }
        }
        return Math.pow(10., exp);
    }

    public static int getInteger(final CharSequence csq) throws NumberFormatException {
        return getInteger(csq, 0, csq.length());
    }

    public static int getInteger(final CharSequence csq,
                                 final int offset, final int end) throws NumberFormatException {

        int off = offset;

        boolean sign = false;
        char ch;

        if ((end == 0)
                || (((ch = csq.charAt(off)) < '0') || (ch > '9'))
                && (!(sign = ch == '-') || (++off == end) || (((ch = csq.charAt(off)) < '0') || (ch > '9')))) {
            throw new NumberFormatException(csq.toString());
        }
        // check overflow:
        final int limit = (sign) ? (-Integer.MAX_VALUE / 10) : (-Integer.MIN_VALUE / 10); // inline

        for (int ival = 0;; ival *= 10) {
            ival += '0' - ch; // negative
            if (++off == end) {
                return sign ? ival : -ival;
            }
            if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
                throw new NumberFormatException(csq.toString());
            }
            if (ival < limit) {
                throw new NumberFormatException(csq.toString());
            }
        }
    }

    /*
     Parse [-]DDDDD (no length and overflow checks)
     */
    public static int getIntegerUnsafe(final CharSequence csq) throws NumberFormatException {
        return getIntegerUnsafe(csq, 0, csq.length());
    }

    /*
     Parse [-]DDDDD (no length and overflow checks)
     */
    public static int getIntegerUnsafe(final CharSequence csq,
                                       final int offset, final int end) throws NumberFormatException {

        int off = offset;

        boolean sign = false;
        char ch;

        if ((((ch = csq.charAt(off)) < '0') || (ch > '9'))
                && (!(sign = ch == '-') || (++off == end) || (((ch = csq.charAt(off)) < '0') || (ch > '9')))) {
            throw new NumberFormatException(csq.toString());
        }

        for (int ival = 0;; ival *= 10) {
            ival += '0' - ch; // negative
            if (++off == end) {
                return sign ? ival : -ival;
            }
            if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
                throw new NumberFormatException(csq.toString());
            }
        }
    }

    /*
     Parse [+/-]DDDDD (no length and overflow checks)
     */
    public static double getIntegerUnsafeAsDouble(final CharSequence csq,
                                                  final int offset, final int end) throws NumberFormatException {

        int off = offset;

        boolean sign = true;
        char ch;

        // TODO: support +/-
        if ((((ch = csq.charAt(off)) < '0') || (ch > '9'))
                && (!((sign = ch == '+') || (ch == '-')) || (++off == end) || (((ch = csq.charAt(off)) < '0') || (ch > '9')))) {
            throw new NumberFormatException(csq.toString());
        }

        for (double dval = 0;; dval *= 10d) {
            dval += ch - '0'; // positive
            if (++off == end) {
                return sign ? dval : -dval;
            }
            if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
                throw new NumberFormatException(csq.toString());
            }
        }
    }

    /*
     Parse DDDDD (no length and overflow checks)
     */
    public static int getPositiveIntegerUnsafe(final CharSequence csq,
                                               final int offset, final int end) throws NumberFormatException {

        int off = offset;

        char ch;

        if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
            throw new NumberFormatException(csq.toString());
        }

        for (int ival = 0;; ival *= 10) {
            ival += ch - '0'; // positive
            if (++off == end) {
                return ival;
            }
            if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
                throw new NumberFormatException(csq.toString());
            }
        }
    }

    /*
     Parse DDDDD (no length and overflow checks)
     */
    public static double getPositiveIntegerUnsafeAsDouble(final CharSequence csq,
                                                          final int offset, final int end) throws NumberFormatException {

        int off = offset;

        char ch;

        if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
            throw new NumberFormatException(csq.toString());
        }

        for (double dval = 0.0;; dval *= 10d) {
            dval += ch - '0'; // positive
            if (++off == end) {
                return dval;
            }
            if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
                throw new NumberFormatException(csq.toString());
            }
        }
    }

    public static long getLong(final CharSequence csq) throws NumberFormatException {
        return getLong(csq, 0, csq.length());
    }

    public static long getLong(final CharSequence csq,
                               final int offset, final int end) throws NumberFormatException {

        int off = offset;

        boolean sign = false;
        char ch;

        if ((end == 0)
                || (((ch = csq.charAt(off)) < '0') || (ch > '9'))
                && (!(sign = ch == '-') || (++off == end) || (((ch = csq.charAt(off)) < '0') || (ch > '9')))) {
            throw new NumberFormatException(csq.toString());
        }
        // check overflow:
        final long limit = (sign) ? (-Long.MAX_VALUE / 10l) : (-Long.MIN_VALUE / 10l); // inline

        for (long lval = 0l;; lval *= 10l) {
            lval += '0' - ch; // negative
            if (++off == end) {
                return sign ? lval : -lval;
            }
            if (((ch = csq.charAt(off)) < '0') || (ch > '9')) {
                throw new NumberFormatException(csq.toString());
            }
            if (lval < limit) {
                throw new NumberFormatException(csq.toString());
            }
        }
    }

    public static double getDouble(final CharSequence csq) throws NumberFormatException {
        return getDouble(csq, 0, csq.length());
    }

    public static double getDouble(final CharSequence csq,
                                   final int offset, final int end) throws NumberFormatException {

        int off = offset;
        int len = end - offset;

        if (len == 0) {
            return Double.NaN;
        }

        char ch;
        boolean numSign = true;

        ch = csq.charAt(off);
        if (ch == '+') {
            off++;
            len--;
        } else if (ch == '-') {
            numSign = false;
            off++;
            len--;
        }

        double number;

        // Look for the special csqings NaN, Inf,
        if (len >= 3
                && ((ch = csq.charAt(off)) == 'n' || ch == 'N')
                && ((ch = csq.charAt(off + 1)) == 'a' || ch == 'A')
                && ((ch = csq.charAt(off + 2)) == 'n' || ch == 'N')) {

            number = Double.NaN;

            // Look for the longer csqing first then try the shorter.
        } else if (len >= 8
                && ((ch = csq.charAt(off)) == 'i' || ch == 'I')
                && ((ch = csq.charAt(off + 1)) == 'n' || ch == 'N')
                && ((ch = csq.charAt(off + 2)) == 'f' || ch == 'F')
                && ((ch = csq.charAt(off + 3)) == 'i' || ch == 'I')
                && ((ch = csq.charAt(off + 4)) == 'n' || ch == 'N')
                && ((ch = csq.charAt(off + 5)) == 'i' || ch == 'I')
                && ((ch = csq.charAt(off + 6)) == 't' || ch == 'T')
                && ((ch = csq.charAt(off + 7)) == 'y' || ch == 'Y')) {

            number = Double.POSITIVE_INFINITY;

        } else if (len >= 3
                && ((ch = csq.charAt(off)) == 'i' || ch == 'I')
                && ((ch = csq.charAt(off + 1)) == 'n' || ch == 'N')
                && ((ch = csq.charAt(off + 2)) == 'f' || ch == 'F')) {

            number = Double.POSITIVE_INFINITY;

        } else {

            boolean error = true;

            int startOffset = off;
            double dval;

            // TODO: check too many digits (overflow) 
            for (dval = 0d; (len > 0) && ((ch = csq.charAt(off)) >= '0') && (ch <= '9');) {
                dval *= 10d;
                dval += ch - '0';
                off++;
                len--;
            }
            int numberLength = off - startOffset;

            number = dval;

            if (numberLength > 0) {
                error = false;
            }

            // Check for fractional values after decimal
            if ((len > 0) && (csq.charAt(off) == '.')) {

                off++;
                len--;

                startOffset = off;

                // TODO: check too many digits (overflow) 
                for (dval = 0d; (len > 0) && ((ch = csq.charAt(off)) >= '0') && (ch <= '9');) {
                    dval *= 10d;
                    dval += ch - '0';
                    off++;
                    len--;
                }
                numberLength = off - startOffset;

                if (numberLength > 0) {
                    // TODO: try factorizing pow10 with exponent below: only 1 long + operation
                    number += getPow10(-numberLength) * dval;
                    error = false;
                }
            }

            if (error) {
//                throw new NumberFormatException("Invalid Double : " + csq);
                return Double.NaN;
            }

            // Look for an exponent
            if (len > 0) {
                // note: ignore any non-digit character at end:

                if ((ch = csq.charAt(off)) == 'e' || ch == 'E') {

                    off++;
                    len--;

                    if (len > 0) {
                        boolean expSign = true;

                        ch = csq.charAt(off);
                        if (ch == '+') {
                            off++;
                            len--;
                        } else if (ch == '-') {
                            expSign = false;
                            off++;
                            len--;
                        }

                        int exponent = 0;

                        // note: ignore any non-digit character at end:
                        for (exponent = 0; (len > 0) && ((ch = csq.charAt(off)) >= '0') && (ch <= '9');) {
                            exponent *= 10;
                            exponent += ch - '0';
                            off++;
                            len--;
                        }

                        // TODO: check exponent < 1024 (overflow)
                        if (!expSign) {
                            exponent = -exponent;
                        }

                        // For very small numbers we try to miminize
                        // effects of denormalization.
                        if (exponent > -300) {
                            // TODO: cache Math.pow ?? see web page
                            number *= getPow10(exponent);
                        } else {
                            number = 1.0E-300 * (number * getPow10(exponent + 300));
                        }
                    }
                }
            }
            // check other characters:
            if (len > 0) {
//                throw new NumberFormatException("Invalid Double : " + csq);
                return Double.NaN;
            }
        }

        return (numSign) ? number : -number;
    }

    public static int indexOf(final CharSequence csq, final char c, final int off, final int end) {
        for (int i = off; i < end; i++) {
            if (csq.charAt(i) == c) {
                return i;
            }
        }
        return -1;
    }

    public static int indexOfNotDigit(final CharSequence csq, final int off, final int end) {
        for (int i = off; i < end; i++) {
            char ch = csq.charAt(i);
            if ((ch < '0') || (ch > '9')) {
                return i;
            }
        }
        return -1;
    }

    /*
     * White space is defined as ' ', '\t', '\n' or '\r'
     */
    public static int indexOfNotWhiteSpace(final CharSequence csq, final int off, final int end) {
        for (int i = off; i < end; i++) {
            char ch = csq.charAt(i);
            if ((ch != ' ') && (ch != '\t') && (ch != '\n') && (ch != '\r')) {
                return i;
            }
        }
        return off;
    }

    private NumberParser() {
        // utility class
    }
}