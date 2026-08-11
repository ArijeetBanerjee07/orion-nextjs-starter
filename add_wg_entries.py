import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Outreach Tracker')

new_entries = [
    ['27', '1 month temporary lease: 3-room apartment (our oasis \ud83c\udf3f) in Prenzlauer...', '3-Zimmer-Wohnung | 60m\u00b2 | 1200\u20ac', 'Kerstin', '21.07.2026', 'Pending'],
    ['28', 'Helles, m\u00f6bliertes Zimmer zur Zwischenmiete mit Aussicht auf...', '3er WG | 13m\u00b2 | 590\u20ac', 'B. Eymann', '21.07.2026', 'Pending'],
    ['29', 'Zimmer frei in 3er WG (WG 133qm)', '3er WG | 14m\u00b2 | 684\u20ac', 'David Jansen', '21.07.2026', 'Pending'],
    ['30', 'Fhain-Kreuzberg: 17 qm gro\u00dfes Zimmer in 3er-WG in 135 qm 4-Zimmer-...', '3er WG | 17m\u00b2 | 550\u20ac', 'Stanislav Soldo', '21.07.2026', 'Pending'],
    ['31', 'M\u00f6bliertes 25m2 Zimmer in ruhiger 2er-WG (mit Anmeldung)', '2er WG | 25m\u00b2 | 740\u20ac', 'Alisson Novaes', '21.07.2026', 'Pending']
]

# Insert rows at index 30
ws.insert_rows(new_entries, 30)

# Format rows 30 to 34 using formatting from row 29
for col_char in ['A', 'B', 'C', 'D', 'E', 'F']:
    cell_fmt = get_user_entered_format(ws, f'{col_char}29')
    if cell_fmt:
        format_cell_range(ws, f'{col_char}30:{col_char}34', cell_fmt)

# After inserting 5 rows, update the summary formulas
# Current formulas were referencing B4:B29 and F4:F29
ws.update_acell('B38', '=COUNTA(B4:B34)')
ws.update_acell('B39', '=COUNTIF(F4:F34,"Yes")')
ws.update_acell('B40', '=COUNTIF(F4:F34,"No")')
ws.update_acell('B41', '=COUNTIF(F4:F34,"Pending")')

print("Successfully added 5 new WG-Gesucht entries and updated formulas.")
