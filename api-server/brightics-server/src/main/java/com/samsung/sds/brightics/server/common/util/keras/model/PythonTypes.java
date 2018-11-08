package com.samsung.sds.brightics.server.common.util.keras.model;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.text.WordUtils;

import java.util.StringJoiner;

public enum PythonTypes {
    STR {
        @Override
        String typeScript(JsonElement value) {
            return String.format("\"\"\"%s\"\"\"", value.getAsString().trim());
        }
    },
    BOOL {
        @Override
        String typeScript(JsonElement value) {
            return WordUtils.capitalizeFully(value.getAsString());
        }
    },
    LIST {
        @Override
        String typeScript(JsonElement value) throws Exception {
            if (value.isJsonPrimitive()) {
                // XXX : metrics
                return String.format("[%s]", STR.typeScript(value));
            } else {
                StringJoiner listJoiner = new StringJoiner(",");

                JsonArray list = value.getAsJsonArray();
                for (JsonElement l : list) {
                    if (l.isJsonPrimitive()) {
                        if (l.getAsJsonPrimitive().isNumber()) {
                            listJoiner.add(NUMBER.typeScript(l));
                        } else if (l.getAsJsonPrimitive().isBoolean()) {
                            listJoiner.add(BOOL.typeScript(l));
                        } else {
                            listJoiner.add(STR.typeScript(l));
                        }
                    } else if (l.isJsonArray()) {
                        listJoiner.add(LIST.typeScript(l));
                    }
                }

                return String.format("[%s]", listJoiner.toString());
            }
        }
    },
    TUPLE {
        @Override
        String typeScript(JsonElement value) throws Exception {
            StringJoiner tupleJoiner = new StringJoiner(",");

            JsonArray tuple = value.getAsJsonArray();
            for (JsonElement t : tuple) {
                if (t.isJsonPrimitive()) {
                    if (!NumberUtils.isNumber(t.getAsString().trim())) {
                        throw new Exception("'%s' is not of Array[Number] type. Entered value is '" + value.toString() + "'");
                    }

                    tupleJoiner.add(t.getAsString().trim());
                } else if (t.isJsonArray()) {
                    tupleJoiner.add(TUPLE.typeScript(t));
                }
            }

            if (tuple.size() == 1) { // python tuple with one value like (16,)
                tupleJoiner.add(StringUtils.EMPTY);
            }

            return String.format("(%s)", tupleJoiner.toString());
        }
    },
    NUMBER {
        @Override
        String typeScript(JsonElement value) throws Exception {
            if (!NumberUtils.isNumber(value.getAsString().trim())) {
                throw new Exception("'%s' is not of Number type. Entered value is '" + value.getAsString() + "'");
            }

            return String.format("%s", value.getAsString().trim());
        }
    },
    FRACTION {
        @Override
        String typeScript(JsonElement value) {
            return String.format("%s", value.getAsString().trim());
        }
    },
    STATEMENTS {
        @Override
        String typeScript(JsonElement value) {
            return String.format("%s", value.getAsString().trim());
        }
    };

    public String script(JsonElement value) throws Exception {
        try {
            if (StringUtils.equals(value.getAsString(), "None")) {
                return "None";
            }
        } catch (IllegalStateException | UnsupportedOperationException e) {
            // DO NOTHING
        }

        return typeScript(value);
    }

    abstract String typeScript(JsonElement value) throws Exception;
}
