import gspread
from gspread_formatting import *

gc = gspread.service_account(filename='wohnnetz-verification-99fdaebc0e55.json')
sh = gc.open_by_key('1jGZHVGF7fx7CZHBfdXvlqbr5kLUN8fQXXy_KPtmRbhk')
ws = sh.worksheet('Outreach Tracker')

values = ws.get_all_values()

insert_idx = None
last_id = 0
for i, row in enumerate(values):
    if len(row) > 0 and row[0] == 'Summary':
        insert_idx = i - 2
        break
    if len(row) > 0 and row[0].isdigit():
        last_id = int(row[0])
        insert_idx = i + 1

new_entries = [
    [str(last_id + 1), 'Furnished 12 m2 Room with Anmeldung in Shared Flat (WG) – Short or Long-Term', '3er WG | 12m² | 600€', 'L. I', '27.07.2026', 'Pending'],
    [str(last_id + 2), 'Bright & Sunny 2-Bedroom Ap in Mitte/Wedding | Fully Furnished | 01.Aug - 30.Sept 2026 (+ 6 months up March 2027)', '2-Zimmer-Wohnung | 60m² | 1300€', 'Dr Mauro Nogueira', '27.07.2026', 'Pending'],
    [str(last_id + 3), 'zimmer mit Balkon in Neukolln', '2er WG | 19m² | 650€', 'Elena', '27.07.2026', 'Pending'],
    [str(last_id + 4), 'Furnished 16 m2 room in central Mitte, Anmeldung possible, balcony, 2 bathrooms', '3er WG | 16m² | 650€', 'Alexander', '27.07.2026', 'Pending'],
    [str(last_id + 5), '(13-23.08) Cozy Studio (Zwischenmiete) Top location near S-Frankfurter Allee', '1-Zimmer-Wohnung | 25m² | 250€', 'Roberta Filizzola', '27.07.2026', 'Pending'],
    [str(last_id + 6), 'Frauen WG Berlin Nord möbliert Balkon mit Anmeldung', '3er WG | 16m² | 575€', 'J. B', '27.07.2026', 'Pending'],
    [str(last_id + 7), 'SCHÖNES RUHIGES ZIMMER (gemeinsames Wohnzimmer und Balkon) IN LIEBEVOLL RENOVIERTER ALTBAUWOHNUNG AM PARK ( möbliert - variabel)', '2er WG | 16m² | 750€', 'Christiane', '27.07.2026', 'Pending'],
    [str(last_id + 8), '2er WEG in goßer heller 3 Zimmer Whg. - nahe FU - Zimmer mit eigenem Balkon - Zimmer 2 & Balkon 2', '2er WG | 18m² | 675€', 'Daniel Pfaffenbach', '27.07.2026', 'Pending'],
    [str(last_id + 9), '2-Raum Apartment zur Zwischenmiete im Richardkiez Neukölln (2-Room Apartment for Sublet - 4 Weeks)', '2-Zimmer-Wohnung | 40m² | 950€', 'Malte S.', '27.07.2026', 'Pending']
]

ws.insert_rows(new_entries, insert_idx + 1)

for col_char in ['A', 'B', 'C', 'D', 'E', 'F']:
    cell_fmt = get_user_entered_format(ws, f'{col_char}{insert_idx}')
    if cell_fmt:
        format_cell_range(ws, f'{col_char}{insert_idx + 1}:{col_char}{insert_idx + len(new_entries)}', cell_fmt)

new_values = ws.get_all_values()
summary_start_idx = None
for i, row in enumerate(new_values):
    if len(row) > 0 and row[0] == 'Summary':
        summary_start_idx = i + 1
        break

data_start_row = 4
data_end_row = insert_idx + len(new_entries)

ws.update_acell(f'B{summary_start_idx + 1}', f'=COUNTA(B{data_start_row}:B{data_end_row})')
ws.update_acell(f'B{summary_start_idx + 2}', f'=COUNTIF(F{data_start_row}:F{data_end_row},"Yes")')
ws.update_acell(f'B{summary_start_idx + 3}', f'=COUNTIF(F{data_start_row}:F{data_end_row},"No")')
ws.update_acell(f'B{summary_start_idx + 4}', f'=COUNTIF(F{data_start_row}:F{data_end_row},"Pending")')

print("Successfully added 9 new WG-Gesucht entries and updated formulas.")
