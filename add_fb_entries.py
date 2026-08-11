import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
fb_ws = sh.worksheet('Facebook Outreach')

new_entries = [
    ['6', '3-Zimmer in Pankow/Grenze Wedding in S-Bahn-N\xe4he + Balkon', 'Berlin, Pankow/Wedding', 'Ana Wetherall-Gruji\u0107', 'Apartments for Rent in Berlin', '20.07.2026 (5h ago)', 'Posted', 'Pending'],
    ['7', 'Teil-m\xf6blierte 2-Zimmerwohnung zur Zwischenmiete in Berlin-Steglitz | Oktober - Dezember 2026', 'Berlin, Steglitz', 'Lorena Mixich', 'Apartments for Rent in Berlin', '20.07.2026 (20h ago)', 'Posted', 'Pending'],
    ['8', 'Lease take over for the month of August with extension and Anmeldung possible', 'Berlin', 'Marie Tess Schmitt-Barker', 'Apartments for Rent in Berlin', '20.07.2026 (Yesterday)', 'Pending group approval', 'Pending']
]

# Insert rows at index 9
fb_ws.insert_rows(new_entries, 9)

# Format rows 9 to 11 using formatting from row 8
for col_char in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']:
    cell_fmt = get_user_entered_format(fb_ws, f'{col_char}8')
    if cell_fmt:
        format_cell_range(fb_ws, f'{col_char}9:{col_char}11', cell_fmt)

# After inserting 3 rows, the summary starts at row 15 (was 12)
# Let's update the formulas just to be safe
fb_ws.update_acell('B15', '=COUNTA(B4:B11)')
fb_ws.update_acell('B16', '=COUNTIF(G4:G11, "Posted")')
fb_ws.update_acell('B17', '=COUNTIF(G4:G11, "Pending group approval")')
fb_ws.update_acell('B18', '=COUNTIF(H4:H11, "Yes")')
fb_ws.update_acell('B19', '=COUNTIF(H4:H11, "No")')
fb_ws.update_acell('B20', '=COUNTIF(H4:H11, "Pending")')

print("Successfully added 3 new entries and updated formulas.")
