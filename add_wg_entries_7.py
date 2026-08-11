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
    [str(last_id + 1), 'Wunderschöne, zentral gelegene Altbauwohnung', '2er WG | 22m² | 809€', 'Roman', '25.07.2026', 'Pending'],
    [str(last_id + 2), 'Möblierte Wohnung ALL INKL. (WLAN etc.) Nähe Potsdamer Platz', '2-Zimmer-Wohnung | 60m² | 1100€', 'Isabel', '25.07.2026', 'Pending'],
    [str(last_id + 3), 'WG Zimmer zu vermieten', '2er WG | 26m² | 1000€', 'Tony Simon', '25.07.2026', 'Pending'],
    [str(last_id + 4), 'Ab 01.08.2026 mit Anmeldung, Nähe HTW und Tesla: Möbliertes Zimmer in 7-er WG auf 2 Etagen, 2 Bäder, Essküche, Balkon', '7er WG | 10m² | 625€', 'Ric', '25.07.2026', 'Pending'],
    [str(last_id + 5), 'Zimmer in 5-er WG in Lichterfelde - Ost', '5er WG | 20m² | 550€', 'Ariane Müller', '25.07.2026', 'Pending'],
    [str(last_id + 6), '15 sqm, girls only, near S-Bahn', '3er WG | 15m² | 560€', 'Jörg', '25.07.2026', 'Pending'],
    [str(last_id + 7), '05.08-30.09.26: möblierte Wohnung 26qm Nähe U6...', '1-Zimmer-Wohnung | 25m² | 600€', 'K', '25.07.2026', 'Pending'],
    [str(last_id + 8), '22 m2 - south, big, light + 2 m2 balcony', '2er WG | 24m² | 790€', 'Obelis', '25.07.2026', 'Pending'],
    [str(last_id + 9), 'Helle 2-Zimmer-Wohnung in Berlin-Neukölln (Weserkiez) -...', '2-Zimmer-Wohnung | 70m² | 1146€', 'Elena', '25.07.2026', 'Pending'],
    [str(last_id + 10), 'wg Zimmer zu zwischenmiete 510€ ab 01.08 Bis 31.01.2027 ""without...', '4er WG | 13m² | 510€', 'F G.', '25.07.2026', 'Pending']
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

print("Successfully added 10 new WG-Gesucht entries and updated formulas.")
