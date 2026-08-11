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
    [str(last_id + 1), 'OFFER: Apartment sublet from now till 32st December near Giesing', 'Giesing', 'Adeel Yawar Jamil', 'Apartments for Rent in Berlin', '21.07.2026 (1h ago)', 'Posted', 'Pending'],
    [str(last_id + 2), 'Zu vermieten: Bezugsfertige 3-Zimmer-Wohnung in 70372 Stuttgart (Bad Cannstatt)', 'Stuttgart (Bad Cannstatt)', 'Maaret Juntunen', 'Apartments for Rent in Berlin', '21.07.2026 (5h ago)', 'Posted', 'Pending'],
    [str(last_id + 3), 'A fully furnished 70 m\u00b2 apartment is available for rent in Berlin-Charlottenburg...', 'Berlin-Charlottenburg', 'Nicola Sparacino', 'Apartments for Rent in Berlin', '21.07.2026 (Yesterday)', 'Posted', 'Pending'],
    [str(last_id + 4), 'FRAUEN-WG | 2 m\u00f6blierte Zimmer auf der Torstra\u00dfe frei', 'Berlin, Torstra\u00dfe', 'Michelle Laralon', 'Apartments for Rent in Berlin', '21.07.2026 (8h ago)', 'Posted', 'Pending'],
    [str(last_id + 5), 'Nachmieter gesucht | 2-Zimmer-Wohnung mit Spreeblick', 'Berlin-Friedrichshain', 'Antonio Di Roberto', 'Apartments for Rent in Berlin', '21.07.2026 (21h ago)', 'Posted', 'Pending']
]

# Insert rows at index `insert_idx + 1` (1-based index)
# Wait, insert_idx is 0-based in my loop. So for gspread it is insert_idx + 1.
ws.insert_rows(new_entries, insert_idx + 1)

# Format rows
for col_char in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']:
    cell_fmt = get_user_entered_format(ws, f'{col_char}{insert_idx}')
    if cell_fmt:
        format_cell_range(ws, f'{col_char}{insert_idx + 1}:{col_char}{insert_idx + len(new_entries)}', cell_fmt)

# Update Summary formulas
summary_start_idx = insert_idx + len(new_entries) + 2
# Let's find exactly where "Summary" is now
new_values = ws.get_all_values()
for i, row in enumerate(new_values):
    if len(row) > 0 and row[0] == 'Summary':
        summary_start_idx = i + 1
        break

# Row numbers for data
data_start_row = 4
data_end_row = insert_idx + len(new_entries)

ws.update_acell(f'B{summary_start_idx + 1}', f'=COUNTA(B{data_start_row}:B{data_end_row})')
ws.update_acell(f'B{summary_start_idx + 2}', f'=COUNTIF(G{data_start_row}:G{data_end_row}, "Posted")')
ws.update_acell(f'B{summary_start_idx + 3}', f'=COUNTIF(G{data_start_row}:G{data_end_row}, "Pending group approval")')
ws.update_acell(f'B{summary_start_idx + 4}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "Yes")')
ws.update_acell(f'B{summary_start_idx + 5}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "No")')
ws.update_acell(f'B{summary_start_idx + 6}', f'=COUNTIF(H{data_start_row}:H{data_end_row}, "Pending")')

print("Successfully added 5 new Facebook entries and updated formulas.")
