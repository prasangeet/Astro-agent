# scratch_chart.py

import swisseph as swe

jd = swe.julday(
    2001,
    4,
    10,
    14.5,
)

sun = swe.calc_ut(
    jd,
    swe.SUN,
)

print(sun)
