## Format
### Python
```python
from brightics.function.statistics import pairplot
res = pairplot(table = ,x_vars = ,y_vars = ,kind = ,diag_kind = ,hue = ,markers = ,palette = ,height = ,aspect = ,dropna = ,group_by = )
res['result']
```

## Description
This function draws a pairplot using seaborn package. 

Reference:
+ <https://seaborn.pydata.org/generated/seaborn.pairplot.html>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **X Columns**<b style="color:red">*</b>: X Columns to plot.
   - Allowed column type : Integer, Long, Double, Float
2. **Y Columns**: Y Columns. If not specified, X Columns are chosen by default.
   - Allowed column type : Integer, Long, Double, Float
3. **Off Diagonal**: Kind of plot.
   - Available items
      - scatter (default)
      - reg
4. **Diagonal**: Kind of plot for the diagonal subplots.
   - Available items
      - auto (default)
      - hist
      - kde
5. **Color By**: Color By.
   - Allowed column type : Integer, Long, Double, String
6. **Markers**: Markers for each point. See <https://matplotlib.org/api/markers_api.html>.
7. **Palette**: Set of colors for mapping the Color By variable. Possible values are: Accent, Accent_r, Blues, Blues_r, BrBG, BrBG_r, BuGn, BuGn_r, BuPu, BuPu_r, CMRmap, CMRmap_r, Dark2, Dark2_r, GnBu, GnBu_r, Greens, Greens_r, Greys, Greys_r, OrRd, OrRd_r, Oranges, Oranges_r, PRGn, PRGn_r, Paired, Paired_r, Pastel1, Pastel1_r, Pastel2, Pastel2_r, PiYG, PiYG_r, PuBu, PuBuGn, PuBuGn_r, PuBu_r, PuOr, PuOr_r, PuRd, PuRd_r, Purples, Purples_r, RdBu, RdBu_r, RdGy, RdGy_r, RdPu, RdPu_r, RdYlBu, RdYlBu_r, RdYlGn, RdYlGn_r, Reds, Reds_r, Set1, Set1_r, Set2, Set2_r, Set3, Set3_r, Spectral, Spectral_r, Vega10, Vega10_r, Vega20, Vega20_r, Vega20b, Vega20b_r, Vega20c, Vega20c_r, Wistia, Wistia_r, YlGn, YlGnBu, YlGnBu_r, YlGn_r, YlOrBr, YlOrBr_r, YlOrRd, YlOrRd_r, afmhot, afmhot_r, autumn, autumn_r, binary, binary_r, bone, bone_r, brg, brg_r, bwr, bwr_r, cool, cool_r, coolwarm, coolwarm_r, copper, copper_r, cubehelix, cubehelix_r, flag, flag_r, gist_earth, gist_earth_r, gist_gray, gist_gray_r, gist_heat, gist_heat_r, gist_ncar, gist_ncar_r, gist_rainbow, gist_rainbow_r, gist_stern, gist_stern_r, gist_yarg, gist_yarg_r, gnuplot, gnuplot2, gnuplot2_r, gnuplot_r, gray, gray_r, hot, hot_r, hsv, hsv_r, icefire, icefire_r, inferno, inferno_r, jet, jet_r, magma, magma_r, mako, mako_r, nipy_spectral, nipy_spectral_r, ocean, ocean_r, pink, pink_r, plasma, plasma_r, prism, prism_r, rainbow, rainbow_r, rocket, rocket_r, seismic, seismic_r, spectral, spectral_r, spring, spring_r, summer, summer_r, tab10, tab10_r, tab20, tab20_r, tab20b, tab20b_r, tab20c, tab20c_r, terrain, terrain_r, viridis, viridis_r, vlag, vlag_r, winter, winter_r
   - Value type : String
8. **Height**: Height (in inches) of each facet.
   - Value type : Double
   - Default : 2.5 (value > 0.0)
9. **Aspect**: Aspect * Height gives the width (in inches).
   - Value type : Double
   - Default : 1 (value > 0.0)
10. **Drop NA**: Drop missing values from the data before plotting.
11. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **x_vars**<b style="color:red">*</b>: X Columns to plot.
   - Allowed column type : Integer, Long, Double, Float
2. **y_vars**: Y Columns. If not specified, X Columns are chosen by default.
   - Allowed column type : Integer, Long, Double, Float
3. **kind**: Kind of plot.
   - Available items
      - scatter (default)
      - reg
4. **diag_kind**: Kind of plot for the diagonal subplots.
   - Available items
      - auto (default)
      - hist
      - kde
5. **hue**: Color By.
   - Allowed column type : Integer, Long, Double, String
6. **markers**: Markers for each point. See <https://matplotlib.org/api/markers_api.html>.
7. **palette**: Set of colors for mapping the Color By variable. Possible values are: Accent, Accent_r, Blues, Blues_r, BrBG, BrBG_r, BuGn, BuGn_r, BuPu, BuPu_r, CMRmap, CMRmap_r, Dark2, Dark2_r, GnBu, GnBu_r, Greens, Greens_r, Greys, Greys_r, OrRd, OrRd_r, Oranges, Oranges_r, PRGn, PRGn_r, Paired, Paired_r, Pastel1, Pastel1_r, Pastel2, Pastel2_r, PiYG, PiYG_r, PuBu, PuBuGn, PuBuGn_r, PuBu_r, PuOr, PuOr_r, PuRd, PuRd_r, Purples, Purples_r, RdBu, RdBu_r, RdGy, RdGy_r, RdPu, RdPu_r, RdYlBu, RdYlBu_r, RdYlGn, RdYlGn_r, Reds, Reds_r, Set1, Set1_r, Set2, Set2_r, Set3, Set3_r, Spectral, Spectral_r, Vega10, Vega10_r, Vega20, Vega20_r, Vega20b, Vega20b_r, Vega20c, Vega20c_r, Wistia, Wistia_r, YlGn, YlGnBu, YlGnBu_r, YlGn_r, YlOrBr, YlOrBr_r, YlOrRd, YlOrRd_r, afmhot, afmhot_r, autumn, autumn_r, binary, binary_r, bone, bone_r, brg, brg_r, bwr, bwr_r, cool, cool_r, coolwarm, coolwarm_r, copper, copper_r, cubehelix, cubehelix_r, flag, flag_r, gist_earth, gist_earth_r, gist_gray, gist_gray_r, gist_heat, gist_heat_r, gist_ncar, gist_ncar_r, gist_rainbow, gist_rainbow_r, gist_stern, gist_stern_r, gist_yarg, gist_yarg_r, gnuplot, gnuplot2, gnuplot2_r, gnuplot_r, gray, gray_r, hot, hot_r, hsv, hsv_r, icefire, icefire_r, inferno, inferno_r, jet, jet_r, magma, magma_r, mako, mako_r, nipy_spectral, nipy_spectral_r, ocean, ocean_r, pink, pink_r, plasma, plasma_r, prism, prism_r, rainbow, rainbow_r, rocket, rocket_r, seismic, seismic_r, spectral, spectral_r, spring, spring_r, summer, summer_r, tab10, tab10_r, tab20, tab20_r, tab20b, tab20b_r, tab20c, tab20c_r, terrain, terrain_r, viridis, viridis_r, vlag, vlag_r, winter, winter_r
   - Value type : String
8. **height**: Height (in inches) of each facet.
   - Value type : Double
   - Default : 2.5 (value > 0.0)
9. **aspect**: Aspect * Height gives the width (in inches).
   - Value type : Double
   - Default : 1 (value > 0.0)
10. **dropna**: Drop missing values from the data before plotting.
11. **group_by**: Columns to group by

#### Outputs: model

