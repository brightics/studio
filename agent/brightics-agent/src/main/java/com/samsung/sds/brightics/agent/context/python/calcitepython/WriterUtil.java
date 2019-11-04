package com.samsung.sds.brightics.agent.context.python.calcitepython;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.calcite.plan.RelOptTable;
import org.apache.calcite.rel.RelCollation;
import org.apache.calcite.rel.RelFieldCollation;
import org.apache.calcite.rel.RelNode;
import org.apache.calcite.rel.core.AggregateCall;
import org.apache.calcite.rel.logical.LogicalAggregate;
import org.apache.calcite.rel.logical.LogicalFilter;
import org.apache.calcite.rel.logical.LogicalIntersect;
import org.apache.calcite.rel.logical.LogicalJoin;
import org.apache.calcite.rel.logical.LogicalProject;
import org.apache.calcite.rel.logical.LogicalSort;
import org.apache.calcite.rel.logical.LogicalTableScan;
import org.apache.calcite.rel.logical.LogicalUnion;
import org.apache.calcite.rel.logical.LogicalValues;
import org.apache.calcite.rel.type.RelDataTypeField;
import org.apache.calcite.rex.RexCall;
import org.apache.calcite.rex.RexInputRef;
import org.apache.calcite.rex.RexLiteral;
import org.apache.calcite.rex.RexNode;
import org.apache.calcite.sql.SqlBinaryOperator;
import org.apache.calcite.sql.SqlOperator;
import org.apache.calcite.sql.SqlPostfixOperator;
import org.apache.calcite.sql.SqlPrefixOperator;
import org.apache.calcite.sql.fun.SqlCastFunction;
import org.apache.calcite.sql.type.SqlTypeName;
import org.apache.calcite.util.NlsString;

import com.google.common.collect.ImmutableList;

public class WriterUtil {

	static public void relNodeToMap(RelNode rel, Map<String, Object> map) throws Exception {
		if (rel instanceof LogicalTableScan) {
			logicalTableScanToMap((LogicalTableScan) rel, map);
		} else if (rel instanceof LogicalProject) {
			logicalProjectToMap((LogicalProject) rel, map);
		} else if (rel instanceof LogicalJoin) {
			logicalJoinToMap((LogicalJoin) rel, map);
		} else if (rel instanceof LogicalFilter) {
			logicalFilterToMap((LogicalFilter) rel, map);
		} else if (rel instanceof LogicalAggregate) {
			logicalAggregateToMap((LogicalAggregate) rel, map);
		} else if (rel instanceof LogicalSort) {
			logicalSortToMap((LogicalSort) rel, map);
		} else if (rel instanceof LogicalValues) {
			logicalValuesToMap((LogicalValues) rel, map);
		} else if (rel instanceof LogicalUnion) {
			logicalUnionToMap((LogicalUnion) rel, map);
		} else if (rel instanceof LogicalIntersect) {
			logicalIntersectToMap((LogicalIntersect) rel, map);
		} else {
			throw new Exception("Unknown RelNode Type or UnImplemented RelNode Type");
		}
	}

	static public void setRelCommonFields(RelNode rel, Map<String, Object> map) throws Exception {

		List<RelDataTypeField> relFieldList = rel.getRowType().getFieldList();
		ImmutableList.Builder<String> dtype = new ImmutableList.Builder<String>();
		ImmutableList.Builder<String> field = new ImmutableList.Builder<String>();
		for (RelDataTypeField fd : relFieldList) {
			field.add(fd.getName());
			dtype.add(fd.getType().toString());
		}

		map.put("field", field.build());
		map.put("dtype", dtype.build());
		map.put("relTypeName", rel.getRelTypeName());
		map.put("id", rel.getId());

		ImmutableList.Builder<Map<String, Object>> inputs = new ImmutableList.Builder<Map<String, Object>>();

		for (RelNode r : rel.getInputs()) {
			Map<String, Object> relMap = new HashMap<String, Object>();
			relNodeToMap(r, relMap);
			inputs.add(relMap);
		}
		map.put("inputs", inputs.build());

	}

	static public void logicalTableScanToMap(LogicalTableScan rel, Map<String, Object> map) throws Exception {

		RelOptTable table = rel.getTable();

		setRelCommonFields(rel, map);
		map.put("schemaName", table.getQualifiedName().get(0));
		map.put("tableName", table.getQualifiedName().get(1));
	}

	static public void logicalProjectToMap(LogicalProject rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		ImmutableList.Builder<Map<String, Object>> exps = new ImmutableList.Builder<Map<String, Object>>();
		for (RexNode exp : rel.getProjects()) {
			Map<String, Object> expMap = new HashMap<String, Object>();
			rexNodeToMap(exp, expMap);
			exps.add(expMap);
		}
		map.put("exps", exps.build());

	}

	static public void rexNodeToMap(RexNode rex, Map<String, Object> map) throws Exception {

		if (rex instanceof RexCall) {
			rexCallToMap((RexCall) rex, map);
		} else if (rex instanceof RexInputRef) {
			rexInputRefToMap((RexInputRef) rex, map);
		} else if (rex instanceof RexLiteral) {
			rexLiteralToMap((RexLiteral) rex, map);
		} else {
			throw new Exception("Unknown RexNode Type or UnImplemented RexNode Type");
		}
	}

	static public void setRexCommonFields(RexNode rex, Map<String, Object> map) {
		map.put("rexTypeName", rex.getClass().getSimpleName());

	}

	static public SqlTypeName getSqlType(String type) throws Exception {
		if (type.equalsIgnoreCase("double")) {
			return SqlTypeName.DOUBLE;
		} else if (type.contentEquals("string")) {
			return SqlTypeName.VARCHAR;
		} else if (type.contentEquals("integer")) {
			return SqlTypeName.INTEGER;
		} else if (type.contentEquals("boolean")) {
			return SqlTypeName.BOOLEAN;
		} else {
			throw new Exception("Unknown for unimplemented data type");
		}

	}

	static public DTypes sqlTypeToPdType(SqlTypeName sqlName) {
		switch (sqlName) {
		case BIGINT:
			return DTypes.INT64;
		case INTEGER:
			return DTypes.INT64;
		case VARCHAR:
			return DTypes.OBJECT;
		case DOUBLE:
			return DTypes.FLOAT64;
		case DECIMAL:
			return DTypes.FLOAT64;
		default:
			return null;
		}
	}

	static public String divideOrFloorDivide(List<RexNode> oprds) {
		DTypes ltype = sqlTypeToPdType(oprds.get(0).getType().getSqlTypeName());
		DTypes rtype = sqlTypeToPdType(oprds.get(1).getType().getSqlTypeName());
		if (ltype.equals(DTypes.FLOAT64) || rtype.equals(DTypes.FLOAT64)) {
			return "DIVIDE";
		} else {
			return "FLOORDIVIDE";
		}
	}

	static public void rexCallToMap(RexCall rex, Map<String, Object> map) throws Exception {

		setRexCommonFields(rex, map);
		SqlOperator op = rex.getOperator();
		if (op instanceof SqlBinaryOperator) {
			map.put("opInstance", "SqlBinaryOperator");
		} else if (op instanceof SqlCastFunction) {
			map.put("opInstance", "SqlCastFunction");
		} else if (op instanceof SqlPrefixOperator) {
			map.put("opInstance", "SqlPrefixOperator");
		} else if (op instanceof SqlPostfixOperator) {
			map.put("opInstance", "SqlPostfixOperator");
		} else {
			map.put("opInstance", "unknownOrUnimplemented");
		}

		String opKind = rex.getOperator().getKind().name();
		if (opKind.equals("DIVIDE")) {
			opKind = divideOrFloorDivide(rex.getOperands());
		}

		map.put("opKind", opKind);

		String operator = rex.getOperator().getName();
		if (opKind.equals("FLOORDIVIDE")) {
			operator = "//";
		}
		map.put("operator", operator);

		ImmutableList.Builder<Map<String, Object>> oprds = new ImmutableList.Builder<Map<String, Object>>();
		for (RexNode oprd : rex.getOperands()) {
			Map<String, Object> oprdMap = new HashMap<String, Object>();
			rexNodeToMap(oprd, oprdMap);
			oprds.add(oprdMap);
		}

		map.put("operands", oprds.build());
	}

	static public void rexInputRefToMap(RexInputRef rex, Map<String, Object> map) {
		setRexCommonFields(rex, map);
		map.put("index", rex.getIndex());
	}

	@SuppressWarnings("rawtypes")
	static public void rexLiteralToMap(RexLiteral rex, Map<String, Object> map) {
		setRexCommonFields(rex, map);

		Comparable value = rex.getValue();
		if (value instanceof NlsString) {
			map.put("valueInstance", "NlsString");
			map.put("value", ((NlsString) value).getValue());
		} else if (value instanceof BigDecimal) {
			map.put("valueInstance", "BigDecimal");
			map.put("value", ((BigDecimal) value).toEngineeringString());
		} else if (value instanceof Boolean) {
			map.put("valueInstance", "Boolean");
			map.put("value", value);
		} else if (value instanceof Integer) {
			map.put("valueInstance", "Integer");
			map.put("value", value);
		}
	}

	static public void logicalJoinToMap(LogicalJoin rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		Map<String, Object> condMap = new HashMap<String, Object>();
		rexNodeToMap(rel.getCondition(), condMap);
		map.put("condition", condMap);
		map.put("joinType", rel.getJoinType().toString());
	}

	static public void logicalFilterToMap(LogicalFilter rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		Map<String, Object> condMap = new HashMap<String, Object>();
		rexNodeToMap(rel.getCondition(), condMap);
		map.put("condition", condMap);

	}

	static public void logicalSortToMap(LogicalSort rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		if (rel.fetch != null) {
			Map<String, Object> fetchMap = new HashMap<String, Object>();
			rexNodeToMap(rel.fetch, fetchMap);
			map.put("fetch", fetchMap);
		} else {
			map.put("fetch", null);
		}

		RelCollation collation = rel.getCollation();
		List<RelFieldCollation> fieldCollations = collation.getFieldCollations();
		ImmutableList.Builder<String> direction = new ImmutableList.Builder<String>();
		ImmutableList.Builder<Integer> fieldIndex = new ImmutableList.Builder<Integer>();
		for (RelFieldCollation rfc : fieldCollations) {
			direction.add(rfc.getDirection().toString());
			fieldIndex.add(rfc.getFieldIndex());
		}

		map.put("collationDirection", direction.build());
		map.put("collationFieldIndex", fieldIndex.build());

	}

	static public void logicalValuesToMap(LogicalValues rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		ImmutableList.Builder<ImmutableList<Map<String, Object>>> builder = new ImmutableList.Builder<ImmutableList<Map<String, Object>>>();

		// for(ImmutableList<RexLiteral> tuple:rel.tuples) {
		for (ImmutableList<RexLiteral> tuple : rel.getTuples()) {

			ImmutableList.Builder<Map<String, Object>> bder = new ImmutableList.Builder<Map<String, Object>>();
			for (RexLiteral tp : tuple) {
				Map<String, Object> tpMap = new HashMap<String, Object>();
				rexLiteralToMap(tp, tpMap);
				bder.add(tpMap);
			}
			builder.add(bder.build());
		}
		map.put("tuples", builder.build());
	}

	static public void logicalUnionToMap(LogicalUnion rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		map.put("all", rel.all);

	}

	static public void logicalIntersectToMap(LogicalIntersect rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		map.put("all", rel.all);

	}

	static public void aggregateCallToMap(AggregateCall aggCall, Map<String, Object> map) {

		map.put("aggFunc", aggCall.getAggregation().getName());
		map.put("argList", aggCall.getArgList());
		map.put("distinct", aggCall.isDistinct());
	}

	static public void logicalAggregateToMap(LogicalAggregate rel, Map<String, Object> map) throws Exception {

		setRelCommonFields(rel, map);

		map.put("GroupSet", rel.getGroupSet().toList());

		ImmutableList.Builder<Map<String, Object>> aggCalls = new ImmutableList.Builder<Map<String, Object>>();
		for (AggregateCall aggCall : rel.getAggCallList()) {
			Map<String, Object> aggMap = new HashMap<String, Object>();
			aggregateCallToMap(aggCall, aggMap);
			aggCalls.add(aggMap);
		}
		map.put("aggregateCalls", aggCalls.build());
	}
}
