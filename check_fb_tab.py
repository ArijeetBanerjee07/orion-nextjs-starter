import gspread

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')

print("Worksheets:")
for ws in sh.worksheets():
    print(ws.title)

fb_ws = None
for ws in sh.worksheets():
    if 'facebook' in ws.title.lower():
        fb_ws = ws
        break

if fb_ws:
    print(f"\nFound Facebook tab: {fb_ws.title}")
    print("First 5 rows:")
    for i, row in enumerate(fb_ws.get_all_values()[:5]):
        print(f"Row {i+1}: {row}")
else:
    print("\nNo Facebook tab found.")
