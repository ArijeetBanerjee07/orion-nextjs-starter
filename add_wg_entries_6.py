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
    [str(last_id + 1), 'Loft in Graefekiez', '1-Zimmer-Wohnung | 40m² | 1550€', 'Ms/Mrs Hassmann', '23.07.2026', 'Pending'],
    [str(last_id + 2), 'apartment in the Heart of neukölln for three month sublet', '1-Zimmer-Wohnung | 55m² | 950€', 'Nina', '23.07.2026', 'Pending'],
    [str(last_id + 3), 'Furnished 16 m2 room in central Mitte, Anmeldung possible, balcony, 2...', '3er WG | 16m² | 650€', 'Alexander', '23.07.2026', 'Pending'],
    [str(last_id + 4), 'sehr große WG Zimmer mit Balkon', '4er WG | 26m² | 650€', 'D A', '23.07.2026', 'Pending'],
    [str(last_id + 5), 'Helle 1,5-Zimmer Altbauwohnung in Berlin-Karlshorst - ruhig, charmant ...', '1,5-Zimmer-Wohnung | 60m² | 1200€', 'N Noack', '23.07.2026', 'Pending']
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
