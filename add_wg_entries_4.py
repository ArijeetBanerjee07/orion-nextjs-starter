import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Outreach Tracker')

# Get all values to find where to insert
values = ws.get_all_values()

# Find the last row before "Summary"
insert_idx = None
last_id = 0
for i, row in enumerate(values):
    if len(row) > 0 and row[0] == 'Summary':
        insert_idx = i - 2 # usually there are two blank rows before Summary
        break
    if len(row) > 0 and row[0].isdigit():
        last_id = int(row[0])
        insert_idx = i + 1

new_entries = [
    [str(last_id + 1), 'Furnished 2-room apartment with sunny balcony at Olivaer Platz,...', '2-room apartment | 70m\u00b2 | \u20ac1500', 'Mr. Miller', '22.07.2026', 'Pending'],
    [str(last_id + 2), 'Ab 24.7. ruhiges kleines Zimmer in Mitte in 3er Wg', '3er WG | 12m\u00b2 | 450\u20ac', 'Luise', '22.07.2026', 'Pending'],
    [str(last_id + 3), 'EXTRAORDINARY SPACE TIME FEELING', '3er WG | 18m\u00b2 | 900\u20ac', 'Lili', '22.07.2026', 'Pending'],
    [str(last_id + 4), 'Zimmer in Kreuzberg 61 Hinterhaus, EG', '2er WG | 21m\u00b2 | 650\u20ac', 'Christian', '22.07.2026', 'Pending'],
    [str(last_id + 5), 'WG-Zimmer (2er), m\u00f6bliert, all-inkl., 37 qm im Gr\u00fcnen bis max 03/2027', '2er WG | 37m\u00b2 | 790\u20ac', 'Sven', '22.07.2026', 'Pending'],
    [str(last_id + 6), 'Mitbewohnerin gesucht im Schillerkiez Neuk\u00f6lln', '2er WG | 20m\u00b2 | 520\u20ac', 'Fanny', '22.07.2026', 'Pending']
]

ws.insert_rows(new_entries, insert_idx + 1)

for col_char in ['A', 'B', 'C', 'D', 'E', 'F']:
    cell_fmt = get_user_entered_format(ws, f'{col_char}{insert_idx}')
    if cell_fmt:
        format_cell_range(ws, f'{col_char}{insert_idx + 1}:{col_char}{insert_idx + len(new_entries)}', cell_fmt)

new_values = ws.get_all_values()
summary_start_idx = None
for i, row in enumerate(new_values):
    if len(row) > 0 and row[0] == 'Summary':
        summary_start_idx = i + 1
        break

data_start_row = 4
data_end_row = insert_idx + len(new_entries)

ws.update_acell(f'B{summary_start_idx + 1}', f'=COUNTA(B{data_start_row}:B{data_end_row})')
ws.update_acell(f'B{summary_start_idx + 2}', f'=COUNTIF(F{data_start_row}:F{data_end_row},"Yes")')
ws.update_acell(f'B{summary_start_idx + 3}', f'=COUNTIF(F{data_start_row}:F{data_end_row},"No")')
ws.update_acell(f'B{summary_start_idx + 4}', f'=COUNTIF(F{data_start_row}:F{data_end_row},"Pending")')

print("Successfully added 6 new WG-Gesucht entries and updated formulas.")
