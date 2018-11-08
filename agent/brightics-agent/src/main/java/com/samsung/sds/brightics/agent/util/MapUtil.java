package com.samsung.sds.brightics.agent.util;

import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

public class MapUtil {

    public static <K, V> void removeByValue(Map<K, V> map, V value) {
        Set<K> removalKeys = map.entrySet().stream()
            .filter(entry -> entry.getValue().equals(value))
            .map(Entry::getKey)
            .collect(Collectors.toSet());
        map.keySet().removeAll(removalKeys);
    }
}
