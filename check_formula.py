import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.get_worksheet(0)

# The summary block is now around row 32-36
for row_idx in range(32, 38):
    try:
        val = ws.acell(f'B{row_idx}', value_render_option='FORMULA').value
        print(f"Row {row_idx}: {val}")
    except Exception as e:
        print(f"Row {row_idx}: error {e}")
