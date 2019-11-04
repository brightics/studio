package com.samsung.sds.brightics.agent.context.python.calcitepython;

import static org.apache.calcite.plan.Contexts.EMPTY_CONTEXT;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.plan.RelOptUtil;
import org.apache.calcite.plan.RelTraitDef;
import org.apache.calcite.rel.RelNode;
import org.apache.calcite.rel.type.RelDataTypeSystem;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.calcite.sql.parser.SqlParser;
import org.apache.calcite.tools.FrameworkConfig;
import org.apache.calcite.tools.Frameworks;
import org.apache.calcite.tools.Frameworks.ConfigBuilder;
import org.apache.calcite.tools.Planner;
import org.apache.calcite.tools.RelConversionException;
import org.apache.calcite.tools.RuleSets;
import org.apache.calcite.tools.ValidationException;


import com.samsung.sds.brightics.agent.context.python.calcitepython.WriterUtil;



public class Sql2Pandas {
	private static final Logger LOGGER = LoggerFactory.getLogger(Sql2Pandas.class);
	private CalciteConnection calciteConnection;
	private ConfigBuilder builder;
	private FrameworkConfig config;
	private Planner planner;
	private Properties info;
	
	Gson gson;

	SchemaPlus schema;

	// CONSTRUCTOR

	public Sql2Pandas() {
		try {
			Class.forName("org.apache.calcite.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		GsonBuilder gsonBuilder = new GsonBuilder();
		gson = gsonBuilder.serializeNulls().create();
		info = new Properties();
		info.setProperty("lex", "JAVA");
//		info.setProperty("lex", "ORACLE");
		final String logMessage = "Constructor called: SqlToPandas.Sql2Pandas";
		LOGGER.info(logMessage);
	}

	@SuppressWarnings("rawtypes")
	public Sql2Pandas queryPlanner(String schemaModel) throws SQLException {
		info.put("model", "inline:" + schemaModel);
		calciteConnection = (CalciteConnection) DriverManager.getConnection("jdbc:calcite:", info);
		schema = calciteConnection.getRootSchema().getSubSchema(calciteConnection.getSchema());
		calciteConnection.close();

		final List<RelTraitDef> traitDefs = new ArrayList<RelTraitDef>();

		builder = Frameworks.newConfigBuilder().parserConfig(SqlParser.configBuilder().setCaseSensitive(false).build())
				.defaultSchema(schema).traitDefs(traitDefs).context(EMPTY_CONTEXT) // Context can store data within the
																					// planner session for access by
																					// planner rules
				.ruleSets(RuleSets.ofList()) // Rule sets to use in transformation phases
				.costFactory(null) // Custom cost factory to use during optimization
				.typeSystem(RelDataTypeSystem.DEFAULT);
		config = builder.build();

		String logMessage = "Obtained Schema Info. schema name: " + schema.getName();
		LOGGER.info(logMessage);

		StringBuilder sb = new StringBuilder();
		for (String tbnm : schema.getTableNames()) {
			sb.append(tbnm + ",");
		}

		LOGGER.info(sb.toString());

		return this;
	}

	private RelNode parseSql(String querySTMT) throws SqlParseException, ValidationException, RelConversionException {
		
		LOGGER.info("method call: Sql2pandas.parseSql");
		planner = Frameworks.getPlanner(config);
		SqlNode sqlNode = planner.parse(querySTMT);
		SqlNode validatedNode = planner.validate(sqlNode);

		return planner.convert(validatedNode);

	}

	public String sqlToPdPlanJson(String sqlSTMT) throws Exception {
		LOGGER.info("method call: Sql2pandas.sqlToPdPlanJson");
		RelNode relRoot = parseSql(sqlSTMT);

//		System.out.println(RelOptUtil.toString(relRoot) + "\n");

		return writeRelNodeToJson(relRoot);

	}

	private String writeRelNodeToJson(RelNode root) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		WriterUtil.relNodeToMap(root, map);
		Map<String, Object> rootMap = new HashMap<String, Object>();
		rootMap.put("root", map);
		return gson.toJson(rootMap);
	}

}