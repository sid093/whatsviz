from nltk.corpus import stopwords
from collections import OrderedDict
from datetime import datetime, timedelta
import json
import os
import re
import pandas as pd
import argparse
stop_words = set(stopwords.words('english'))


parser = argparse.ArgumentParser()
parser.add_argument(
    "input_path", help="chat input file path.\n this file will be deleted by default after processing. see --no-delete")
parser.add_argument("output_path", help="output file path")
parser.add_argument("--no-delete",
                    help="dont delete the chat input file after processing",
                    action="store_true")
args = parser.parse_args()

pattern = '^(\\d\\d\\/\\d\\d\\/\\d\\d), (\\d?\\d:\\d\\d ..) - (.+?): (.*)$'

file_in = args.input_path
file_out = args.output_path

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

# Summary
summary = df.groupby(['sender']).size().reset_index()
summary.columns = ['sender', 'count']
output["summary"] = json.loads(summary.to_json(orient='records'))
####################################################################################


# Timeline
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
####################################################################################


# Token Frequency
frequency = df['text'].str.split(
    expand=True).stack().value_counts().to_frame().reset_index()
frequency.columns = ['text', 'count']
frequency_filter = frequency['text'].apply(
    lambda x: ((len(str(x)) < 20) & (len(str(x)) > 2) & (x not in stop_words)))
frequency = frequency[frequency_filter]
frequency['text'] = frequency['text'].str.lower()
frequency = frequency.head(100)
output["frequency"] = json.loads(frequency.to_json(orient='records'))
###################################################################################

out_file = open(file_out, "w")
json.dump(output, out_file, indent=4, sort_keys=False)
out_file.close()

if(not args.no_delete):
    os.remove(file_in)
