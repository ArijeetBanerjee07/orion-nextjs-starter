import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Outreach Tracker')

values = ws.get_all_values()

insert_idx = None
last_id = 0
for i, row in enumerate(values):
    if len(row) > 0 and row[0] == 'Summary':
        insert_idx = i - 2
        break
    if len(row) > 0 and row[0].isdigit():
        last_id = int(row[0])
        insert_idx = i + 1

new_entries = [
    [str(last_id + 1), 'Jungs WG (gayfriendly) 15 m2 mit eigenem SW Balkon Richt. Park, sonni...', '5er WG | 15m\u00b2 | 480\u20ac', 'Herr Fritz', '22.07.2026', 'Pending'],
    [str(last_id + 2), 'Furnished room in a shared apartment (now \u2013 30/11, flexible)', '2er WG | 12m\u00b2 | 800\u20ac', 'Nils', '22.07.2026', 'Pending'],
    [str(last_id + 3), 'Charming Room In Nice Neighborhood', '4er WG | 15m\u00b2 | 800\u20ac', 'Sascha', '22.07.2026', 'Pending'],
    [str(last_id + 4), 'NOW/SOFORT: Bright 2-Bedroom Ap in Mitte/Wedding | Fully Furnished |...', '2-Zimmer-Wohnung | 60m\u00b2 | 1300\u20ac', 'Dr Mauro Nogueira', '22.07.2026', 'Pending'],
    [str(last_id + 5), 'internationale WG / Anmeldung m\u00f6glich', '5er WG | 22m\u00b2 | 490\u20ac', 'Sarah Backhaus', '22.07.2026', 'Pending']
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

print("Successfully added 5 new WG-Gesucht entries and updated formulas.")
