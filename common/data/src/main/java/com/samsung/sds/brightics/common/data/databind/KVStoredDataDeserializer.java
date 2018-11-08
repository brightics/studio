package com.samsung.sds.brightics.common.data.databind;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

public class KVStoredDataDeserializer extends JsonDeserializer<Object> {

    private static final String KEY_PICKLED = "__pickled__";

    @Override
    public Object deserialize(JsonParser parser, DeserializationContext ctxt) throws IOException {
        JsonNode root = parser.getCodec().readTree(parser);
        return parseTree(root);
    }

    private Object parseTree(JsonNode node) {
        if (node.isObject()) {
            return parseObject(node);
        } else if (node.isArray()) {
            List<Object> result = new LinkedList<>();
            for (int i = 0; i < node.size(); i++) {
                result.add(parseTree(node.get(i)));
            }
            return result;
        } else if (node.isBoolean()) {
            return node.booleanValue();
        } else if (node.isNumber()) {
            return node.numberValue();
        } else if (node.isTextual()) {
            if ("NaN".equals(node.asText())) {
                return Double.NaN;
            }
            return node.asText();
        }

        return null;
    }

    private Object parseObject(JsonNode node) {
        if (node.has("__pickled__")) {
            return parsePickedObject(node);
        } else if (node.has("__set__")) {
            Set<Object> result = new HashSet<>();
            JsonNode set = node.get("__set__");
            for (int i = 0; i < set.size(); i++) {
                result.add(parseTree(set.get(i)));
            }
            return result;
        } else if (node.has("__tuple__")) {
            return parseTree(node.get("__tuple__"));
        } else if (node.has("__numpy__")) {
            return parseTree(node.get("__numpy__"));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        Iterator<String> fields = node.fieldNames();
        fields.forEachRemaining(field -> result.put(field, parseTree(node.get(field))));
        return result;
    }

    private Map<String, Object> parsePickedObject(JsonNode node) {
        Map<String, Object> result = new HashMap<>();
        for (Iterator<Entry<String, JsonNode>> it = node.fields(); it.hasNext(); ) {
            Entry<String, JsonNode> entry = it.next();
            if (entry.getKey().equals(KEY_PICKLED)) {
                result.put("type", "python object");
            } else {
                result.put(entry.getKey(), parseTree(entry.getValue()));
            }
        }
        return result;
    }
}
