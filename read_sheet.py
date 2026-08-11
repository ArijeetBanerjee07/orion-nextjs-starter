import gspread

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('17DacLRU6Tm7pSAvxecJI_kTEGL0PpRlH')
worksheet = next((ws for ws in sh.worksheets() if str(ws.id) == '41994212'), None)

if worksheet:
    print(f"Worksheet Name: {worksheet.title}")
    values = worksheet.get_all_values()
    for i, row in enumerate(values):
        if 20 <= i + 1 <= 45:
            print(f"Row {i+1}: {row}")
else:
    print("Worksheet not found")
