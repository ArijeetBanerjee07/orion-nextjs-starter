import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Facebook Outreach')

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
    [str(last_id + 1), 'Hallo ihr Lieben, wir vermieten befristet eine sehr sch\u00f6ne Wohnung...', 'Leipzig S\u00fcdost', 'Roberta & Thomas', 'Facebook Group', '22.07.2026', 'Posted', 'Pending'],
    [str(last_id + 2), 'Wohnung in Fichtenberg zu vermieten...', 'Fichtenberg', 'Mary Dimitriadou', 'Facebook Group', '22.07.2026 (21h ago)', 'Posted', 'Pending'],
    [str(last_id + 3), 'Charmantes, 21 Quadratmeter gro\u00dfes Studio-Apartment...', 'Deutschland', 'Martin Perrino', 'Facebook Group', '22.07.2026 (9h ago)', 'Posted', 'Pending'],
    [str(last_id + 4), '\ud83d\udea8 K\u00f6ln \u2013 TOP 3 Zimmer Wohnung', 'K\u00f6ln', 'Freie Wohnungen in K\u00f6ln - Wohnung gesucht?', 'Facebook Group', '20.07.2026 (22:24)', 'Posted', 'Pending'],
    [str(last_id + 5), 'CENTRUM HEINSBERG APPARTEMENT VOLL M\u00d6BILIERT', 'Heinsberg', 'Ferd Inand', 'Facebook Group', '22.07.2026 (19h ago)', 'Posted', 'Pending'],
    [str(last_id + 6), 'Wir haben folgendes Objekt erfolgreich vermietet:', 'Neuss', 'Rayak Immobilien', 'Facebook Group', '20.07.2026 (16:24)', 'Posted', 'Pending']
]

# Insert rows at index `insert_idx + 1`
ws.insert_rows(new_entries, insert_idx + 1)

# Format rows
for col_char in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']:
    cell_fmt = get_user_entered_format(ws, f'{col_char}{insert_idx}')
    if cell_fmt:
        format_cell_range(ws, f'{col_char}{insert_idx + 1}:{col_char}{insert_idx + len(new_entries)}', cell_fmt)

# Update Summary formulas
new_values = ws.get_all_values()
for i, row in enumerate(new_values):
    if len(row) > 0 and row[0] == 'Summary':
        summary_start_idx = i + 1
        break

data_start_row = 4
data_end_row = insert_idx + len(new_entries)

ws.update_acell(f'B{summary_start_idx + 1}', f'=COUNTA(B{data_start_row}:B{data_end_row})')
ws.update_acell(f'B{summary_start_idx + 2}', f'=COUNTIF(G{data_start_row}:G{data_end_row}, "Posted")')
ws.update_acell(f'B{summary_start_idx + 3}', f'=COUNTIF(G{data_start_row}:G{data_end_row}, "Pending group approval")')
ws.update_acell(f'B{summary_start_idx + 4}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "Yes")')
ws.update_acell(f'B{summary_start_idx + 5}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "No")')
ws.update_acell(f'B{summary_start_idx + 6}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "Pending")')

print("Successfully added 6 new Facebook entries and updated formulas.")
