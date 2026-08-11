import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.get_worksheet(0)

# Fetch rows 38-42
original_rows = ws.get_values('A38:F42')

start_id = int(ws.acell('A24').value) + 1  # Should be 22

new_rows = []
for i, row in enumerate(original_rows):
    if not row or len(row) < 3:
        continue
    date_val = row[0] if len(row) > 0 else ''
    landlord = row[1] if len(row) > 1 else ''
    title = row[2] if len(row) > 2 else ''
    
    parts = date_val.split('-')
    if len(parts) == 3:
        formatted_date = f"{parts[2]}.{parts[1]}.{parts[0]}"
    else:
        formatted_date = date_val

    new_row = [str(start_id + i), title, '', landlord, formatted_date, 'Pending']
    new_rows.append(new_row)

if new_rows:
    # Insert new rows at 25
    ws.insert_rows(new_rows, 25)
    
    # Copy format from row 24
    for i, col_char in enumerate(['A', 'B', 'C', 'D', 'E', 'F']):
        cell_fmt = get_user_entered_format(ws, f'{col_char}24')
        if cell_fmt:
            format_cell_range(ws, f'{col_char}25:{col_char}{24+len(new_rows)}', cell_fmt)
    
    # Delete original rows which shifted down by len(new_rows)
    ws.delete_rows(38 + len(new_rows), 42 + len(new_rows))
    
    print(f"Moved {len(new_rows)} rows successfully.")
    
    # Check if we need to update summary counts manually
    # The summary block was at row 27-31, now it is at 27+len(new_rows) to 31+len(new_rows)
    # Total contacted is at B(28+len(new_rows))
    summary_row = 28 + len(new_rows)
    val = ws.acell(f'B{summary_row}', value_render_option='FORMULA').value
    print(f"Summary Total Contacted Formula/Value: {val}")
    
    if str(val).isdigit():
        # If it was a hardcoded number, update it
        ws.update_acell(f'B{summary_row}', str(int(val) + len(new_rows)))
        ws.update_acell(f'B{summary_row + 3}', str(int(ws.acell(f'B{summary_row + 3}').value) + len(new_rows))) # Pending count
        
else:
    print("No data found in rows 38-42")
