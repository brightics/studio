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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.calcite.config.Lex;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.jdbc.CalciteSchema;
import org.apache.calcite.jdbc.JavaTypeFactoryImpl;
import org.apache.calcite.plan.RelOptUtil;
import org.apache.calcite.plan.RelTraitDef;
import org.apache.calcite.prepare.CalciteCatalogReader;
import org.apache.calcite.rel.RelNode;
import org.apache.calcite.rel.type.RelDataTypeSystem;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.SqlOperatorTable;
import org.apache.calcite.sql.fun.SqlLibrary;
import org.apache.calcite.sql.fun.SqlLibraryOperatorTableFactory;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.calcite.sql.parser.SqlParser;
import org.apache.calcite.sql.util.ChainedSqlOperatorTable;
import org.apache.calcite.sql2rel.SqlToRelConverter;
import org.apache.calcite.tools.*;
import org.apache.calcite.tools.Frameworks.ConfigBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

import static org.apache.calcite.plan.Contexts.EMPTY_CONTEXT;

public class Sql2Pandas {

    public static final Logger LOGGER = LoggerFactory.getLogger(Sql2Pandas.class);
    public Planner planner;
    public Properties info;
    public FrameworkConfig config;

    Gson gson;
    SchemaPlus rootSchema;

    // constructor
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
        LOGGER.info("Constructor called: SqlToPandas.Sql2Pandas");
    }

    public Sql2Pandas queryPlanner(String schemaModel) throws SQLException {
        info.put("model", "inline:" + schemaModel);
        String jdbcConnectString = "jdbc:calcite:";
        CalciteConnection calciteConnection = (CalciteConnection) DriverManager.getConnection(jdbcConnectString, info);
        rootSchema = calciteConnection.getRootSchema();
        SchemaPlus schema = rootSchema.getSubSchema(calciteConnection.getSchema());
        calciteConnection.close();
        // Adding User Defined Functions.
//        addMLUDF(schema);
//        addStatsUDF(schema);

        // Adding operator tables here.
        SqlOperatorTable basicOperatorTable =
                SqlLibraryOperatorTableFactory.INSTANCE.getOperatorTable(
                        EnumSet.of(SqlLibrary.STANDARD, SqlLibrary.MYSQL, SqlLibrary.ORACLE));

        CalciteCatalogReader operatorTableFromSchema = new CalciteCatalogReader(CalciteSchema.from(schema), Collections.<String>emptyList(),
                new JavaTypeFactoryImpl(), null);

        List<SqlOperatorTable> operatorTableChain = new ArrayList<SqlOperatorTable>();
        operatorTableChain.add(basicOperatorTable);
        operatorTableChain.add(operatorTableFromSchema);

        final List<RelTraitDef> traitDefs = new ArrayList<RelTraitDef>();

        final SqlToRelConverter.Config convertConfig = SqlToRelConverter.configBuilder()
                .withExpand(false) // without this, we cannot support some type of subqueries.
                .build();

        final SqlParser.Config parserConfig = SqlParser.configBuilder()
                .setLex(Lex.ORACLE)
                .setCaseSensitive(false)
                .build();

        /*
         Context can store data within the planner session for access by
         planner rules Rule sets to use in transformation phases Custom cost factory to use during optimization
        */
        ConfigBuilder builder = Frameworks.newConfigBuilder()
                .parserConfig(parserConfig)
                .defaultSchema(schema)
                .operatorTable(new ChainedSqlOperatorTable(operatorTableChain))
                .traitDefs(traitDefs)
                .sqlToRelConverterConfig(convertConfig)
                .context(EMPTY_CONTEXT) // Context can store data within the planner session for access by planner rules
                .ruleSets(RuleSets.ofList()) // Rule sets to use in transformation phases
                .costFactory(null) // Custom cost factory to use during optimization
                .typeSystem(RelDataTypeSystem.DEFAULT);

        config = builder.build();
        LOGGER.info("Obtained Schema Info. schema name: " + schema.getName());

        StringBuilder sb = new StringBuilder();
        for (String tablename : schema.getTableNames()) {
            sb.append(tablename).append(", ");
        }
        LOGGER.info(sb.toString());

        return this;
    }

    public String sqlToPdPlanJson(String sqlSTMT) throws Exception {
        LOGGER.info("method called: Sql2pandas.sqlToPdPlanJson");
        LOGGER.info(sqlSTMT);
        RelNode relRoot = parseSql(sqlSTMT);
        System.out.println(RelOptUtil.toString(relRoot) + "\n");
        return writeRelNodeToJson(relRoot);
    }

    public String writeRelNodeToJson(RelNode root) throws Exception {
        Map<String, Object> rootMap = new HashMap<String, Object>();
        rootMap.put("root", WriterUtil.mapRelNode(root));
//		Gson printJson = new GsonBuilder().serializeNulls().setPrettyPrinting().create();
//		System.out.println(printJson.toJson(rootMap));
        return gson.toJson(rootMap);
    }

    public RelNode parseSql(String sqlSTMT) throws SqlParseException, ValidationException, RelConversionException {
        LOGGER.info("method called: Sql2pandas.parseSql");
        planner = Frameworks.getPlanner(config);

        SqlNode sqlNode = planner.parse(sqlSTMT);
        SqlNode validatedNode = planner.validate(sqlNode);
        //return planner.rel(validatedNode).project();
        return planner.rel(validatedNode).project();
    }
}
