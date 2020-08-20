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

package com.samsung.sds.brightics.agent.context.python.calcitePandas;

import com.google.common.collect.ImmutableList;
import org.apache.calcite.rel.RelCollation;
import org.apache.calcite.rel.RelFieldCollation;
import org.apache.calcite.rel.RelNode;
import org.apache.calcite.rel.core.AggregateCall;
import org.apache.calcite.rel.core.CorrelationId;
import org.apache.calcite.rel.logical.*;
import org.apache.calcite.rel.type.RelDataTypeField;
import org.apache.calcite.rex.*;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.fun.*;
import org.apache.calcite.util.NlsString;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.calcite.util.Pair;


public class WriterUtil {
    static public Map<String, Object> mapRelNode(RelNode rel) throws Exception {
        if (rel instanceof LogicalTableScan) {
            return mapLogicalTableScan((LogicalTableScan) rel);
        } else if (rel instanceof LogicalProject) {
            return mapLogicalProject((LogicalProject) rel);
        } else if (rel instanceof LogicalJoin) {
            return mapLogicalJoin((LogicalJoin) rel);
        } else if (rel instanceof LogicalFilter) {
            return mapLogicalFilter((LogicalFilter) rel);
        } else if (rel instanceof LogicalAggregate) {
            return mapLogicalAggregate((LogicalAggregate) rel);
        } else if (rel instanceof LogicalSort) {
            return mapLogicalSort((LogicalSort) rel);
        } else if (rel instanceof LogicalValues) {
            return mapLogicalValues((LogicalValues) rel);
        } else if (rel instanceof LogicalUnion) {
            return mapLogicalUnion((LogicalUnion) rel);
        } else if (rel instanceof LogicalIntersect) {
            return mapLogicalIntersect((LogicalIntersect) rel);
        } else {
            throw new Exception("Unimplemented RelNode Type.");
        }
    }

    static public Map<String, Object> mapRexNode(RexNode rex) throws Exception {
        if (rex instanceof RexCall) {
            return mapRexCall((RexCall) rex);
        } else if (rex instanceof RexInputRef) {
            return mapRexInputRef((RexInputRef) rex);
        } else if (rex instanceof RexLiteral) {
            return mapRexLiteral((RexLiteral) rex);
        } else if (rex instanceof RexFieldAccess) {
            return mapRexFieldAccess((RexFieldAccess) rex);
        } else if (rex instanceof RexCorrelVariable) {
            return mapRexCorrelVariable((RexCorrelVariable) rex);
        } else {
            throw new Exception(
                    "Unknown RexNode Type or UnImplemented RexNode Type");
        }
    }


    static public Map<String, Object> mapRexSubQuery(RexSubQuery rex) throws Exception {
        Map<String, Object> map = mapRexCommonFields(rex);
        map.put("rel", mapRelNode(rex.rel));
        map.put("operator", mapSqlOperator(rex));
        map.put("operands", mapOperands(rex.getOperands()));
        return map;
    }

    static public Map<String, Object> mapSqlOperator(RexCall rex) {
        SqlOperator op = rex.getOperator();
        if (op instanceof SqlBinaryOperator) {
            return mapSqlBinaryOperator((SqlBinaryOperator) op, rex.getOperands());
        } else if (op instanceof SqlCastFunction) {
            return mapSqlCastFunction((SqlCastFunction) op);
        } else if (op instanceof SqlPrefixOperator) {
            return mapSqlPrefixOperator((SqlPrefixOperator) op);
        } else if (op instanceof SqlPostfixOperator) {
            return mapSqlPostfixOperator((SqlPostfixOperator) op);
        } else if (op instanceof SqlFunction) {
            return mapSqlFunction((SqlFunction) op, rex.getOperands());
        } else if (op instanceof SqlSpecialOperator) {
            return mapSqlSpecialOperator((SqlSpecialOperator) op);
        } else {
            Map<String, Object> map = mapSqlOperatorCommonFields(op);
            map.put("instance", "Unimplemented_SqlOperator");
            return map;
        }
    }

    static public Map<String, Object> mapSqlCastFunction(SqlCastFunction op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlCastFunction");
        return map;
    }

    static public Map<String, Object> mapSqlInOperator(SqlInOperator op) {
        if (op instanceof SqlQuantifyOperator) {
            return mapSqlQuantifyOperator((SqlQuantifyOperator) op);
        } else {
            Map<String, Object> map = mapSqlOperatorCommonFields(op);
            map.put("instance", "SqlInOperator");
            return map;
        }
    }

    static public Map<String, Object> mapSqlOperatorCommonFields(SqlOperator op) {
        Map<String, Object> map = new HashMap<>();
        map.put("kind", op.getKind().name());
        map.put("name", op.getName());
        return map;
    }

    static public Map<String, Object> mapComparisonKind(SqlKind comparisionKind) {
        Map<String, Object> map = new HashMap<>();
        map.put("lowerName", comparisionKind.lowerName);
        map.put("sql", comparisionKind.sql);
        map.put("name", comparisionKind.name());
        return map;
    }

    static public Map<String, Object> mapSqlQuantifyOperator(SqlQuantifyOperator op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlQuantifyOperator");
        map.put("comparisonKind", mapComparisonKind(op.comparisonKind));
        return map;
    }

    static public Map<String, Object> mapSqlBinaryOperator(SqlBinaryOperator op, List<RexNode> oprds) {
        if (op instanceof SqlInOperator) {
            return mapSqlInOperator((SqlInOperator) op);
        }
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlBinaryOperator");
        if (op.getKind().name().equals("DIVIDE")) {
            if (divideOrFloorDivide(oprds).equals("FLOORDIVIDE")) {
                map.put("name", "//");
                map.put("kind", "FLOORDIVIDE");
            }
        }
        return map;
    }

    static public ImmutableList<Map<String, Object>> mapOperands(List<RexNode> operands) throws Exception {
        ImmutableList.Builder<Map<String, Object>> builder = new ImmutableList.Builder<>();
        for (RexNode operand : operands) {
            builder.add(mapRexNode(operand));
        }
        return builder.build();
    }

    static public Map<String, Object> mapRexCall(RexCall rex) throws Exception {
        if (rex instanceof RexSubQuery) {
            return mapRexSubQuery((RexSubQuery) rex);
        } else {
            Map<String, Object> map = mapRexCommonFields(rex);
            map.put("operator", mapSqlOperator(rex));
            map.put("operands", mapOperands(rex.getOperands()));
            return map;
        }

    }


    static private Map<String, Object> mapLogicalIntersect(LogicalIntersect rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("all", rel.all);
        return map;
    }

    static private Map<String, Object> mapLogicalUnion(LogicalUnion rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("all", rel.all);
        return map;
    }

    static public ImmutableList<Map<String, Object>> mapTuple(ImmutableList<RexLiteral> tuple) {
        ImmutableList.Builder<Map<String, Object>> builder = new ImmutableList.Builder<>();
        for (RexLiteral r : tuple) {
            builder.add(mapRexLiteral(r));
        }
        return builder.build();
    }

    static public List<ImmutableList<Map<String, Object>>> mapTuples(LogicalValues rel) {
        ImmutableList.Builder<ImmutableList<Map<String, Object>>> builder = new ImmutableList.Builder<>();
        for (ImmutableList<RexLiteral> tuple : rel.tuples) {
            builder.add(mapTuple(tuple));
        }
        return builder.build();
    }

    static public Map<String, Object> mapLogicalValues(LogicalValues rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("tuples", mapTuples(rel));
        return map;
    }

    static public Map<String, Object> mapFetch(LogicalSort rel) throws Exception {
        if (rel.fetch == null) {
            return null;
        } else {
            return mapRexNode(rel.fetch);
        }
    }

    static public Map<String, Object> mapFieldCollation(RelFieldCollation relFieldCollation) {
        Map<String, Object> map = new HashMap<>();
        map.put("direction", relFieldCollation.getDirection().toString());
        map.put("field_index", relFieldCollation.getFieldIndex());
        map.put("null_direction", relFieldCollation.nullDirection.name());
        return map;
    }

    static public List<Map<String, Object>> mapFieldCollations(List<RelFieldCollation> fieldCollations) {
        ImmutableList.Builder<Map<String, Object>> builder = new ImmutableList.Builder<>();
        for (RelFieldCollation relFieldCollation : fieldCollations) {
            builder.add(mapFieldCollation(relFieldCollation));
        }
        return builder.build();
    }

    static public Map<String, Object> mapCollation(LogicalSort rel) {
        RelCollation collation = rel.getCollation();
        Map<String, Object> map = new HashMap<>();
        map.put("fieldCollations", mapFieldCollations(collation.getFieldCollations()));
        return map;
    }

    static public Map<String, Object> mapLogicalSort(LogicalSort rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("fetch", mapFetch(rel));
        map.put("collation", mapCollation(rel));
        return map;
    }


    static public Map<String, Object> mapAggregateCall(AggregateCall aggregateCall) {
        Map<String, Object> map = new HashMap<>();
        map.put("node_type", "aggcall");
        map.put("aggfunc", aggregateCall.getAggregation().getName());
        map.put("arglist", aggregateCall.getArgList());
        map.put("distinct", aggregateCall.isDistinct());
        return map;
    }

    static public List<Map<String, Object>> mapAggregateCalls(LogicalAggregate rel) {
        ImmutableList.Builder<Map<String, Object>> builder = new ImmutableList.Builder<>();
        for (AggregateCall aggCall : rel.getAggCallList()) {
            builder.add(mapAggregateCall(aggCall));
        }
        return builder.build();
    }

    static public Map<String, Object> mapLogicalAggregate(LogicalAggregate rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("groupset", rel.getGroupSet().toList());
        map.put("aggcalls", mapAggregateCalls(rel));
        return map;
    }

    static public Map<String, Object> mapLogicalFilter(LogicalFilter rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("condition", mapRexNode(rel.getCondition()));
        return map;
    }

    static public Map<String, Object> mapLogicalJoin(LogicalJoin rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        map.put("condition", mapRexNode(rel.getCondition()));
        map.put("jointype", rel.getJoinType().toString());
        return map;
    }

    static public Map<String, Object> mapLogicalTableScan(LogicalTableScan rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        ImmutableList.Builder<Pair<String, String>> builder = new ImmutableList.Builder<>();
        builder.add(Pair.of("schema_name", rel.getTable().getQualifiedName().get(0)));
        builder.add(Pair.of("table_name", rel.getTable().getQualifiedName().get(1)));
        map.put("table", builder.build());
        return map;
    }

    static public Map<String, Object> mapLogicalProject(LogicalProject rel) throws Exception {
        Map<String, Object> map = mapRelCommonFields(rel);
        ImmutableList.Builder<Map<String, Object>> exps = new ImmutableList.Builder<>();
        for (RexNode exp : rel.getProjects()) {
            exps.add(mapRexNode(exp));
        }
        map.put("exps", exps.build());
        return map;
    }

    static public List<Pair<String, String>> mapRelDataTypeField(RelNode rel) {
        ImmutableList.Builder<Pair<String, String>> builder = new ImmutableList.Builder<>();
        for (RelDataTypeField reldatatypefield : rel.getRowType().getFieldList()) {
            builder.add(Pair.of(reldatatypefield.getName(), reldatatypefield.getType().toString()));
        }
        return builder.build();
    }

    static public List<String> mapVariableSet(RelNode rel) {
        ImmutableList.Builder<String> builder = new ImmutableList.Builder<>();
        for (CorrelationId var : rel.getVariablesSet()) {
            builder.add(var.getName());
        }
        return builder.build();
    }

    static public List<Object> mapRelInputs(RelNode rel) throws Exception {
        ImmutableList.Builder<Object> builder = new ImmutableList.Builder<>();
        for (RelNode input : rel.getInputs()) {
            builder.add(mapRelNode(input));
        }
        return builder.build();
    }

    static public Map<String, Object> mapRelCommonFields(RelNode rel) throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("node_type", "relNode");
        map.put("id", rel.getId());
        map.put("rel_typename", rel.getRelTypeName());
        map.put("fieldList", mapRelDataTypeField(rel));
        map.put("variableSet", mapVariableSet(rel));
        map.put("inputs", mapRelInputs(rel));
        return map;
    }

    static public Map<String, Object> mapRexCommonFields(RexNode rex) {
        Map<String, Object> map = new HashMap<>();
        map.put("node_type", "rexNode");
        map.put("rex_typename", rex.getClass().getSimpleName());
        return map;
    }


    static private String divideOrFloorDivide(List<RexNode> oprds) {

        DTypes ltype = DTypeConverter.sqlToJavaType(oprds.get(0).getType().getSqlTypeName());
        DTypes rtype = DTypeConverter.sqlToJavaType(oprds.get(1).getType().getSqlTypeName());

        assert ltype != null;
        assert rtype != null;
        if (ltype.equals(DTypes.FLOAT64) || rtype.equals(DTypes.FLOAT64)) {
            return "DIVIDE";
        } else {
            return "FLOORDIVIDE";
        }
    }


    static public Map<String, Object> mapSqlPrefixOperator(SqlPrefixOperator op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlPrefixOperator");
        return map;
    }


    static public Map<String, Object> mapSqlPostfixOperator(SqlPostfixOperator op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlPostfixOperator");
        return map;
    }

    static public Map<String, Object> mapNumericFunction(SqlFunction op, List<RexNode> oprds) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlFunction");
        map.put("sqlfunction_category", "NUMERIC");
        if (op.getName().equals("POWER")) {
            map.put("name", powerOrSqrt((RexLiteral) oprds.get(1)));
        }
        return map;
    }

    static public Map<String, Object> mapStringFunction(SqlFunction op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlFunction");
        map.put("sqlfunction_category", "STRING");
        return map;
    }

    static public Map<String, Object> mapUserDefinedFunction(SqlFunction op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        map.put("instance", "SqlFunction");
        map.put("sqlfunction_category", "USER_DEFINED_FUNCTION");
        return map;
    }

    static public Map<String, Object> mapOtherFunction(SqlFunction op, List<RexNode> oprds) {
        switch (op.getFunctionType().name()) {
            case "NUMERIC":
                return mapNumericFunction(op, oprds);
            case "STRING":
                return mapStringFunction(op);
            case "USER_DEFINED_FUNCTION":
                return mapUserDefinedFunction(op);
            default:
                Map<String, Object> map = mapSqlOperatorCommonFields(op);
                map.put("instance", "SqlFunction");
                map.put("sqlfunction_category", "Unimplemented_SqlFunctionCategory");
                return map;
        }
    }

    static public Map<String, Object> mapSqlFunction(SqlFunction op, List<RexNode> oprds) {
        switch (op.getKind().name()) {
            case "OTHER_FUNCTION":
            case "FLOOR":
            case "MOD":
            case "CEIL":
            case "REVERSE":
            case "TRIM":
            case "POSITION":
                return mapOtherFunction(op, oprds);
            default:
                Map<String, Object> map = mapSqlOperatorCommonFields(op);
                map.put("instance", "Unimplemented_SqlFunction");
                return map;
        }
    }


    @SuppressWarnings("rawtypes")
    static public String powerOrSqrt(RexLiteral rex) {
        Comparable value = rex.getValue();
        if (value instanceof BigDecimal && ((BigDecimal) value).toEngineeringString().equals("0.5")) {
            return "SQRT";
        } else {
            return "POWER";
        }
    }

//
//    static private Map<String, Object> statsOperandsToMap(RexCall rex) throws Exception {
//
//        Map<String, Object> statsParams = new HashMap<String, Object>();
//        List<String> paramNames = UDFS.StatsFunction.StatsFunctionParamNames();
//        List<RexNode> oprds = rex.getOperands();
//        int nParams = paramNames.size();
//
//        for (int i = 0; i < nParams; i++) {
//            Map<String, Object> oprdMap = new HashMap<String, Object>();
//            rexNodeToMap(oprds.get(i), oprdMap);
//            statsParams.put(paramNames.get(i), oprdMap);
//        }
//
//        return statsParams;
//
//    }
//
//
//    static private Map<String, Object> mlTrainOperandsToMap(RexCall rex) throws Exception {
//
//        Map<String, Object> mlTrainParams = new HashMap<String, Object>();
//        List<String> paramNames = UDFS.MlTrain.MlTrainParamNames();
//        List<RexNode> oprds = rex.getOperands();
//        int nParams = paramNames.size();
//
//        for (int i = 0; i < nParams; i++) {
//            Map<String, Object> oprdMap = new HashMap<String, Object>();
//            rexNodeToMap(oprds.get(i), oprdMap);
//            mlTrainParams.put(paramNames.get(i), oprdMap);
//        }
//
//        return mlTrainParams;
//    }

    static public Map<String, Object> mapSqlSpecialOperator(SqlSpecialOperator op) {
        Map<String, Object> map = mapSqlOperatorCommonFields(op);
        switch (op.getKind().name()) {
            case "DEFAULT":
                map.put("instance", "SqlDefaultOperator");
                break;
            case "ARRAY_VALUE_CONSTRUCTOR":
                map.put("instance", "ARRAY_VALUE_CONSTRUCTOR");
                break;
            case "SCALAR_QUERY":
                map.put("instance", "SCALAR_QUERY");
                break;
            default:
                map.put("instance", "Unimplemented_SqlSpecialOperator");
                break;
        }
        return map;
    }

    @SuppressWarnings(value = "rawtypes")
    static public Map<String, Object> mapRexLiteral(RexLiteral rex) {
        Map<String, Object> map = mapRexCommonFields(rex);
        Comparable value = rex.getValue();
        if (value instanceof NlsString) {
            map.put("value_instance", "NlsString");
            map.put("value", ((NlsString) value).getValue());
        } else if (value instanceof BigDecimal) {
            map.put("value_instance", "BigDecimal");
            map.put("value", ((BigDecimal) value).toEngineeringString());
        } else if (value instanceof Boolean) {
            map.put("value_instance", "Boolean");
            map.put("value", value);
        } else if (value instanceof Integer) {
            map.put("value_instance", "Integer");
            map.put("value", value);
        } else if (value instanceof SqlTrimFunction.Flag) {
            map.put("value_instance", "SqlTrimFunction$Flag");
            map.put("value", value);
        } else {
            map.put("value_instance", "unimplemented value type");
            map.put("value", value);
        }
        return map;
    }


    static public Map<String, Object> mapRexInputRef(RexInputRef rex) {
        Map<String, Object> map = mapRexCommonFields(rex);
        map.put("index", rex.getIndex());
        return map;
    }


    static public Map<String, Object> mapRexFieldAccess(RexFieldAccess rex) throws Exception {
        Map<String, Object> map = mapRexCommonFields(rex);
        map.put("expr", mapRexNode(rex.getReferenceExpr()));
        map.put("field", rex.getField().getName());
        return map;
    }

    static public Map<String, Object> mapRexCorrelVariable(RexCorrelVariable rex) {
        Map<String, Object> map = mapRexCommonFields(rex);
        map.put("name", rex.getName());
        return map;
    }

}
