import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.get_worksheet(0)

ws.update_acell('B33', '=COUNTA(B4:B29)')
ws.update_acell('B34', '=COUNTIF(F4:F29,"Yes")')
ws.update_acell('B35', '=COUNTIF(F4:F29,"No")')
ws.update_acell('B36', '=COUNTIF(F4:F29,"Pending")')

print("Formulas updated successfully.")
