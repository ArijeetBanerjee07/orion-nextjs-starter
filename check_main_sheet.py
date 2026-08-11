import gspread

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Outreach Tracker')

print("Fetching first 40 rows to understand the current structure...")
for i, row in enumerate(ws.get_all_values()[:40]):
    print(f"Row {i+1}: {row}")
