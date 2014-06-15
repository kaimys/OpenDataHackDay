# -*- coding: utf-8 -*-

import json
import yaml
import copy
import psycopg2

# Connect to Postgres
conn = psycopg2.connect("dbname='parliament' user='kai' password='blahblah'")

data = {}

# Check table 'abstimmung' for runaways
cur = conn.cursor()
cur.execute("""
select abstimmung.source_etag, person.partei, abstimmung.vote, count(*)
from abstimmung, person
where person.fingerprint = abstimmung.fingerprint
group by abstimmung.source_etag, person.partei, abstimmung.vote
order by abstimmung.source_etag, person.partei, abstimmung.vote
""")
tmpl = { 'id': None, 'parties': {}, 'runaways_party': [] }
party_tmpl = { 'yes': 0, 'no': 0, 'absent':0, 'abstention': 0, 'runaways': 0}
ger_dict = {'Ja': 'yes', 'Nein': 'no', 'Nicht abg': 'absent', 'Enthaltung': 'abstention'}

rows = cur.fetchall()
abst = copy.deepcopy(tmpl)
vote_results = []
for row in rows:
    if row[0] != abst['id']:
        # Add abst data
        cur2 = conn.cursor()
        cur2.execute("select date, subject, source_url from abstimmung where source_etag = '%s' limit 1" % abst['id'])
        rows2 = cur2.fetchall()
        if(len(rows2)) > 0:
            abst['date'] = rows2[0][0]
            abst['subject'] = rows2[0][1]
            abst['source_url'] = rows2[0][2]
        cur2.close()
        # analysis
        for party in abst['parties']:
            votes = abst['parties'][party]
            max_votes = max(votes['yes'], votes['no'])
            min_votes = min(votes['yes'], votes['no'])
            if max_votes > 0 and min_votes > 0:
                abst['runaways_party'].append(party)
                if max_votes == votes['yes']:
                    votes['runaways'] = votes['no']
                else:
                    votes['runaways'] = votes['yes']
                print yaml.safe_dump(abst)
        vote_results.append(abst)
        # create new one
        abst = copy.deepcopy(tmpl)
        abst['id'] = row[0]
    if row[1] != None:
        party = row[1]
        if row[1] == 'fraktionslos':
            party = 'no_fraction'
        if not abst['parties'].has_key(party):
            abst['parties'][party] = copy.deepcopy(party_tmpl)
        if row[2] in ['Ja', 'Nein', 'Nicht abg', 'Enthaltung']:
            abst['parties'][party][ger_dict[row[2]]] = int(row[3])
data['votes'] = vote_results

# Write the result
with open('data.json', 'w') as outfile:
  json.dump(data, outfile, indent=4)
