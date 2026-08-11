import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Facebook Outreach')

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
    [str(last_id + 1), 'Direct Message: "Hi Adeel,"', '', 'Adeel Yawar Jamil', 'Direct Message', '23.07.2026', 'Messaged', 'Pending']
]

ws.insert_rows(new_entries, insert_idx + 1)

for col_char in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']:
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
ws.update_acell(f'B{summary_start_idx + 2}', f'=COUNTIF(G{data_start_row}:G{data_end_row}, "Posted")')
ws.update_acell(f'B{summary_start_idx + 3}', f'=COUNTIF(G{data_start_row}:G{data_end_row}, "Pending group approval")')
ws.update_acell(f'B{summary_start_idx + 4}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "Yes")')
ws.update_acell(f'B{summary_start_idx + 5}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "No")')
ws.update_acell(f'B{summary_start_idx + 6}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "Pending")')

print("Successfully added Facebook Direct Message entry and updated formulas.")
