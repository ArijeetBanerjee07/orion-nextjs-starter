import gspread

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
fb_ws = sh.worksheet('Facebook Outreach')

for i, row in enumerate(fb_ws.get_all_values()):
    if i >= 2: # start from row 3
        print(f"Row {i+1}: {row}")
