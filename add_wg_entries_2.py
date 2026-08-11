import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Outreach Tracker')

new_entries = [
    ['32', '18qm Zimmer in einer WG in Berlin Wedding', '2er WG | 18m\u00b2 | 690\u20ac', 'Lasse', '21.07.2026', 'Pending'],
    ['33', 'Modernes WG-Zimmer in Adlershof \u2013 N\u00e4he H...', '3er WG | 7m\u00b2 | 490\u20ac', 'Michael Gro\u00dfe - AKM Berlin Immobilien GmbH', '21.07.2026', 'Pending'],
    ['34', 'Modern Room with big balcony Berlin Friedrichshain', '2er WG | 28m\u00b2 | 30\u20ac', 'A. M', '21.07.2026', 'Pending'],
    ['35', 'WG Zimmer - Berlin Wei\u00dfensee - Altbau', '2er WG | 23m\u00b2 | 600\u20ac', 'Joseph', '21.07.2026', 'Pending'],
    ['36', '2er WG helle , sch\u00f6ne und gro\u00dfe M\u00f6belierte Berlin K\u00f6penick/Treptow', '2er WG | 20m\u00b2 | 570\u20ac', 'Claudia R.', '21.07.2026', 'Pending'],
    ['37', 'BIG ROOM IN FRAUEN WG 25qm', '3er WG | 25m\u00b2 | 650\u20ac', 'Antonio', '21.07.2026', 'Pending']
]

# Insert rows at index 35
ws.insert_rows(new_entries, 35)

# Format rows 35 to 40 using formatting from row 34
for col_char in ['A', 'B', 'C', 'D', 'E', 'F']:
    cell_fmt = get_user_entered_format(ws, f'{col_char}34')
    if cell_fmt:
        format_cell_range(ws, f'{col_char}35:{col_char}40', cell_fmt)

# After inserting 6 rows, the summary formulas (which were pushed down to start around row 43+ probably, wait...)
# In the last turn, summary was at rows 37-43.
# Let's dynamically find the summary rows and update them.
values = ws.get_all_values()
for i, row in enumerate(values):
    if len(row) > 0 and row[0] == 'Summary':
        summary_start_idx = i + 1
        break

# The counts are at summary_start_idx + 1, + 2, + 3, + 4
ws.update_acell(f'B{summary_start_idx + 1}', '=COUNTA(B4:B40)')
ws.update_acell(f'B{summary_start_idx + 2}', '=COUNTIF(F4:F40,"Yes")')
ws.update_acell(f'B{summary_start_idx + 3}', '=COUNTIF(F4:F40,"No")')
ws.update_acell(f'B{summary_start_idx + 4}', '=COUNTIF(F4:F40,"Pending")')

print("Successfully added 6 new WG-Gesucht entries and updated formulas.")
