import gspread

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
worksheet = sh.get_worksheet(0)

if worksheet:
    print(f"Worksheet Name: {worksheet.title}")
    values = worksheet.get_all_values()
    for i, row in enumerate(values):
        if 20 <= i + 1 <= 50:
            print(f"Row {i+1}: {row}")
else:
    print("Worksheet not found")
