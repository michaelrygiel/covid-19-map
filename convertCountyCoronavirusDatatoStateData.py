import csv

states = []
with open('coronavirusCountyData.csv', 'r') as f:
	reader = csv.reader(f)
	headers = next(reader, None)
	setofStates = set()
	for row in reader:
		if row[2] in setofStates:
			for state in states:
				if state['stateID'] == row[0][0:2]:
					#add to state counts
					state['confirmed'] += int(row[7])
					state['deaths'] += int(row[8])
					state['recovered'] += int(row[9])
					state['active'] += int(row[10])
					break
		else:
			if row[2] and row[0]:
				state = {}
				state['stateID'] = row[0][0:2]
				state['stateName'] = row[2]
				state['confirmed'] = int(row[7])
				state['deaths'] = int(row[8])
				state['recovered'] = int(row[9])
				state['active'] = int(row[10])
				setofStates.add(row[2])
				states.append(state)

	print(states)
	#Write states to csv
with open('coronavirusStateData.csv', 'w', newline='') as csvfile:
	writer = csv.writer(csvfile)
	fieldnames = ['stateID','stateName','confirmed','deaths','recovered','active']
	writer.writerow(fieldnames)
	for state in states:
		writer.writerow([state['stateID'],state['stateName'],state['confirmed'],state['deaths'],state['recovered'],state['active']])
