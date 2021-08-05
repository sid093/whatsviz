from collections import OrderedDict
from datetime import date, datetime, time, timedelta
import sys
import json
import os
import re
import pandas as pd


pattern = '^(\\d\\d\\/\\d\\d\\/\\d\\d), (\\d?\\d:\\d\\d ..) - (.+?): (.*)$'

args = sys.argv
if(len(args) != 3):
    print('Provide the input/output chat file as a command line argument!')
    sys.exit()


file_in = args[1]
file_out = args[2]

with open(file_in, "r", encoding="utf8") as fh:
    lines = fh.readlines()

parsed_input = []

for line in lines:
    matches = re.findall(pattern, line)
    if(len(matches) > 0):
        converted_line = {
            "date": matches[0][0],
            "time": matches[0][1],
            "sender": matches[0][2],
            "text": matches[0][3]
        }
        parsed_input.append(converted_line)
    elif(len(parsed_input) > 0):
        parsed_input[len(parsed_input) - 1]['text'] += line

df = pd.DataFrame(parsed_input)
df['date'] = pd.to_datetime(df['date'], format='%d/%m/%y')

output = {}

summary = df.groupby(['sender']).size().reset_index()
summary.columns = ['sender', 'count']
output["summary"] = json.loads(summary.to_json(orient='records'))

startDate = min(df['date'].dt.strftime('%Y-%m-%d'))
endDate = max(df['date'].dt.strftime('%Y-%m-%d'))
dates = [startDate, endDate]
start, end = [datetime.strptime(_, "%Y-%m-%d") for _ in dates]
timelineLabels = list(OrderedDict(((start + timedelta(_)).strftime(r"%b-%y"), None)
                      for _ in range((end - start).days)).keys())
timelineSenderData = df['sender'].unique().tolist()
timelineData = []

df['yearmonth'] = df['date'].dt.strftime('%b-%y')
timeline = df.groupby(['sender', 'yearmonth']).size().reset_index()
timeline.columns = ['sender', 'yearmonth', 'count']

for sender in timelineSenderData:
    counts = []

    for period in timelineLabels:
        found = timeline[(timeline['sender'] == sender) &
                         (timeline['yearmonth'] == period)]
        if found.empty:
            counts.append(0)
        else:
            counts.append(int(found.iloc[0]['count']))

    timelineData.append({"sender": sender, "counts": counts})


output["timeline"] = {
    "labels": timelineLabels,
    "data": timelineData
}
out_file = open(file_out, "w")
json.dump(output, out_file, indent=4, sort_keys=False)
out_file.close()

# os.remove(file_in)
