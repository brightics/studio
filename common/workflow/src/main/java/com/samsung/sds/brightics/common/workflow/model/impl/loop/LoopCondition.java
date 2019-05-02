/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.common.workflow.model.impl.loop;

import com.google.gson.JsonArray;
import com.google.gson.JsonPrimitive;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.Data;

@Data
public final class LoopCondition {

    LoopType type;

    // for counter type
    Integer start;
    Integer end;
    Integer step = 1;

    // for collection type
    JsonArray collection;
    String indexVariable;
    String elementVariable;

    private LoopCondition() {
    }

    public static LoopCondition getCountLoopCondition(Integer start, Integer end, String indexVariable) {
        LoopCondition countCondition = new LoopCondition();
        countCondition.setType(LoopType.COUNT);
        countCondition.setStart(start);
        countCondition.setEnd(end);
        countCondition.setIndexVariable(indexVariable);
        return countCondition;
    }

    public static LoopCondition getCollectionLoopCondition(JsonArray collection, String indexVariable, String elementVariable) {
        LoopCondition collectionCondition = new LoopCondition();
        collectionCondition.setType(LoopType.COLLECTION);
        collectionCondition.setCollection(collection);
        collectionCondition.setIndexVariable(indexVariable);
        collectionCondition.setElementVariable(elementVariable);
        return collectionCondition;
    }

    public Iterator<LoopStatus> iterator() {
        List<LoopStatus> result = new ArrayList<>();
        if (this.type == LoopType.COUNT) {
            int count = 1;
            int total = ((end - start) / step) + 1;
            for (int idx = start; idx <= end; idx += step) {
                LoopStatus stat = new LoopStatus(idx, new JsonPrimitive(idx));
                stat.setIndexVariable(indexVariable);
                stat.setCount(count++);
                stat.setTotal(total);
                result.add(stat);
            }
        } else if (this.type == LoopType.COLLECTION) {
            AtomicInteger idx = new AtomicInteger(0);
            collection.forEach(elem -> {
                LoopStatus stat = new LoopStatus(idx.getAndIncrement(), elem);
                stat.setCount(idx.get());
                stat.setIndexVariable(indexVariable);
                stat.setElementVariable(elementVariable);
                stat.setTotal(collection.size());
                result.add(stat);
            });
        }
        return result.iterator();
    }
}
